"""
Database Migration: Add layout_params to OnePagers
===================================================

This migration adds the layout_params field to existing OnePager documents.

**What it does:**
- Adds layout_params field with default values to all OnePagers without it
- Adds design_rationale field (initially None)
- Updates updated_at timestamp

**How to run:**
    python backend/scripts/migrate_layout_params.py

**How to rollback:**
    python backend/scripts/migrate_layout_params.py rollback

**Safety:**
- Does not modify existing layout_params if already present
- Does not modify other fields (content, title, etc.)
- Can be safely re-run multiple times (idempotent)
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings
from backend.models.onepager import get_default_layout_params


async def count_documents_without_layout_params(collection) -> int:
    """Count OnePagers without layout_params field."""
    return await collection.count_documents({
        "layout_params": {"$exists": False}
    })


async def count_documents_with_layout_params(collection) -> int:
    """Count OnePagers with layout_params field."""
    return await collection.count_documents({
        "layout_params": {"$exists": True}
    })


async def migrate_forward():
    """
    Migration: Add layout_params to existing OnePagers.

    Adds default layout_params to all documents that don't have it.
    """
    print("=" * 70)
    print("MIGRATION: Add layout_params to OnePagers")
    print("=" * 70)
    print()

    # Connect to database
    print(f"📡 Connecting to MongoDB: {settings.mongodb_url}")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]
    collection = db.onepagers

    try:
        # Check database connection
        await client.admin.command('ping')
        print("✅ Database connection successful")
        print()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return

    # Count documents
    total_count = await collection.count_documents({})
    without_params_count = await count_documents_without_layout_params(collection)

    print(f"📊 Database Statistics:")
    print(f"   Total OnePagers: {total_count}")
    print(f"   Without layout_params: {without_params_count}")
    print(f"   With layout_params: {total_count - without_params_count}")
    print()

    if without_params_count == 0:
        print("✅ No migration needed. All documents already have layout_params.")
        client.close()
        return

    # Confirm migration
    print(f"⚠️  This will add layout_params to {without_params_count} documents.")
    confirmation = input("Continue? (yes/no): ").strip().lower()
    if confirmation != 'yes':
        print("❌ Migration cancelled by user.")
        client.close()
        return

    print()
    print("🚀 Starting migration...")

    # Prepare default layout_params
    default_params = get_default_layout_params().dict()

    # Update documents
    try:
        result = await collection.update_many(
            {"layout_params": {"$exists": False}},
            {
                "$set": {
                    "layout_params": default_params,
                    "design_rationale": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        print(f"✅ Migration completed successfully!")
        print(f"   Matched documents: {result.matched_count}")
        print(f"   Modified documents: {result.modified_count}")
        print()

    except Exception as e:
        print(f"❌ Migration failed: {e}")
        client.close()
        return

    # Verification
    print("🔍 Verifying migration...")
    with_params_count = await count_documents_with_layout_params(collection)

    print(f"   Documents with layout_params: {with_params_count}")

    if with_params_count == total_count:
        print("✅ Verification passed! All documents have layout_params.")
    else:
        print(f"⚠️  Warning: {total_count - with_params_count} documents still missing layout_params")

    # Sample check
    print()
    print("📄 Sample document (first OnePager):")
    sample = await collection.find_one({"layout_params": {"$exists": True}})
    if sample:
        print(f"   Title: {sample.get('title', 'N/A')}")
        print(f"   Has layout_params: ✓")
        print(f"   Has design_rationale: ✓")
        print(f"   Spacing: {sample['layout_params']['spacing']['section_gap']}")
        print(f"   Typography h1_scale: {sample['layout_params']['typography']['h1_scale']}")

    client.close()
    print()
    print("=" * 70)
    print("MIGRATION COMPLETE")
    print("=" * 70)


async def migrate_rollback():
    """
    Rollback: Remove layout_params and design_rationale fields.

    WARNING: This will permanently remove all layout customizations.
    """
    print("=" * 70)
    print("ROLLBACK: Remove layout_params from OnePagers")
    print("=" * 70)
    print()
    print("⚠️  WARNING: This will permanently delete all layout customizations!")
    print("⚠️  Content and other fields will NOT be affected.")
    print()

    confirmation = input("Are you sure you want to rollback? (type 'ROLLBACK' to confirm): ").strip()
    if confirmation != 'ROLLBACK':
        print("❌ Rollback cancelled.")
        return

    # Connect to database
    print()
    print(f"📡 Connecting to MongoDB: {settings.mongodb_url}")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]
    collection = db.onepagers

    try:
        await client.admin.command('ping')
        print("✅ Database connection successful")
        print()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return

    # Count documents to rollback
    with_params_count = await count_documents_with_layout_params(collection)

    print(f"📊 Documents with layout_params: {with_params_count}")
    print()

    if with_params_count == 0:
        print("✅ No rollback needed. No documents have layout_params.")
        client.close()
        return

    print("🔙 Starting rollback...")

    # Remove fields
    try:
        result = await collection.update_many(
            {},
            {
                "$unset": {
                    "layout_params": "",
                    "design_rationale": ""
                },
                "$set": {
                    "updated_at": datetime.utcnow()
                }
            }
        )

        print(f"✅ Rollback completed successfully!")
        print(f"   Matched documents: {result.matched_count}")
        print(f"   Modified documents: {result.modified_count}")
        print()

    except Exception as e:
        print(f"❌ Rollback failed: {e}")
        client.close()
        return

    # Verification
    print("🔍 Verifying rollback...")
    remaining_count = await count_documents_with_layout_params(collection)

    if remaining_count == 0:
        print("✅ Verification passed! All layout_params removed.")
    else:
        print(f"⚠️  Warning: {remaining_count} documents still have layout_params")

    client.close()
    print()
    print("=" * 70)
    print("ROLLBACK COMPLETE")
    print("=" * 70)


async def show_status():
    """Show current migration status."""
    print("=" * 70)
    print("MIGRATION STATUS")
    print("=" * 70)
    print()

    # Connect to database
    print(f"📡 Connecting to MongoDB: {settings.mongodb_url}")
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_db_name]
    collection = db.onepagers

    try:
        await client.admin.command('ping')
        print("✅ Database connection successful")
        print()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return

    # Statistics
    total_count = await collection.count_documents({})
    with_params_count = await count_documents_with_layout_params(collection)
    without_params_count = await count_documents_without_layout_params(collection)

    print(f"📊 Database Statistics:")
    print(f"   Total OnePagers: {total_count}")
    print(f"   With layout_params: {with_params_count} ({100 * with_params_count // max(total_count, 1)}%)")
    print(f"   Without layout_params: {without_params_count} ({100 * without_params_count // max(total_count, 1)}%)")
    print()

    if without_params_count > 0:
        print("💡 Run migration: python backend/scripts/migrate_layout_params.py")
    else:
        print("✅ All documents have layout_params!")

    client.close()


def main():
    """Main entry point."""
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == 'rollback':
            asyncio.run(migrate_rollback())
        elif command == 'status':
            asyncio.run(show_status())
        elif command == 'help':
            print(__doc__)
            print()
            print("Available commands:")
            print("  python backend/scripts/migrate_layout_params.py          - Run migration")
            print("  python backend/scripts/migrate_layout_params.py rollback - Rollback migration")
            print("  python backend/scripts/migrate_layout_params.py status   - Show status")
            print("  python backend/scripts/migrate_layout_params.py help     - Show this help")
        else:
            print(f"❌ Unknown command: {command}")
            print("Run 'python backend/scripts/migrate_layout_params.py help' for usage.")
    else:
        # Default: run migration
        asyncio.run(migrate_forward())


if __name__ == "__main__":
    main()
