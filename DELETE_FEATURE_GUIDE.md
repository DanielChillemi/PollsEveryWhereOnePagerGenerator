# Delete Feature - Quick Reference Guide

## Visual Overview

### Dashboard with Delete Buttons

```
┌──────────────────────────────────────────────────────────────┐
│  Your One-Pagers                              [View All]      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ [wireframe]  │  │  [styled]    │  │   [final]    │       │
│  │ 🎨 Branded  🗑│  │ 🎨 Branded  🗑│  │             🗑│       │
│  │              │  │              │  │              │       │
│  │ Product      │  │ Sales        │  │ Marketing    │       │
│  │ Launch 2024  │  │ Enablement   │  │ Strategy     │       │
│  │              │  │              │  │              │       │
│  │ Updated      │  │ Updated      │  │ Updated      │       │
│  │ 10/08/2025   │  │ 10/07/2025   │  │ 10/06/2025   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- 🗑️ = Delete button (trash icon) in top-right of each card
- Hover state: Delete button becomes more visible
- Click card → Navigate to canvas
- Click 🗑️ → Confirmation dialog

---

## User Interaction Flow

### 1. Hover Over Card
```
┌──────────────┐
│ [wireframe]  │  ← Card highlights
│ 🎨 Branded  🗑│  ← Delete button visible
│              │
│ Product      │
│ Launch 2024  │
└──────────────┘
```

### 2. Click Delete Button
```
╔═══════════════════════════════════════════════════════╗
║  Confirm Delete                                   [X] ║
╟───────────────────────────────────────────────────────╢
║                                                       ║
║  Are you sure you want to delete                     ║
║  "Product Launch 2024"?                              ║
║                                                       ║
║  This action cannot be undone.                       ║
║                                                       ║
║             [Cancel]            [OK]                 ║
╚═══════════════════════════════════════════════════════╝
```

### 3. During Deletion (Loading State)
```
┌──────────────┐
│ [wireframe]  │
│ 🎨 Branded  ⏳│  ← Spinner on delete button
│              │
│ Product      │  ← Card still visible
│ Launch 2024  │
└──────────────┘
```

### 4. After Successful Deletion
```
┌──────────────────────────────────────────────────────────────┐
│  Your One-Pagers                              [View All]      │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐                          │
│  │  [styled]    │  │   [final]    │                          │
│  │ 🎨 Branded  🗑│  │             🗑│                          │
│  │              │  │              │                          │
│  │ Sales        │  │ Marketing    │                          │
│  │ Enablement   │  │ Strategy     │  ← Card removed! ✨      │
│  └──────────────┘  └──────────────┘                          │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Code Examples

### Delete a One-Pager Programmatically

```typescript
import { useOnePagerDelete } from '@/hooks/useOnePagerDelete'

function MyComponent() {
  const { deleteOnePager, isPending, error } = useOnePagerDelete()
  
  const handleDelete = async (id: string) => {
    try {
      await deleteOnePager(id)
      console.log('Deleted successfully!')
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  
  return (
    <button 
      onClick={() => handleDelete('12345')}
      disabled={isPending}
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

### With Confirmation Dialog

```typescript
const handleDeleteWithConfirm = async (id: string, title: string) => {
  const confirmed = window.confirm(
    `Delete "${title}"?\n\nThis cannot be undone.`
  )
  
  if (confirmed) {
    await deleteOnePager(id)
    // Dashboard auto-refreshes via React Query
  }
}
```

---

## API Reference

### Backend Endpoint

```
DELETE /api/v1/onepagers/{onepager_id}

Authorization: Bearer <token>

Response: 204 No Content (success)
          404 Not Found
          403 Forbidden (not owner)
          401 Unauthorized
```

### Frontend Hook

```typescript
useOnePagerDelete()

Returns:
  - deleteOnePager: (id: string) => Promise<void>
  - isPending: boolean
  - error: Error | null
  - isSuccess: boolean
```

---

## Keyboard Shortcuts (Future Enhancement)

```
Hover card + Press 'Delete' key → Trigger delete
Hover card + Press 'Backspace' → Trigger delete
In confirmation dialog:
  - Press 'Enter' → Confirm delete
  - Press 'Escape' → Cancel
```

---

## Accessibility Features

### Current
- ✅ `aria-label="Delete one-pager"` on button
- ✅ Button is keyboard accessible
- ✅ Confirmation dialog is native (accessible)

### Future Improvements
- [ ] Screen reader announces "One-pager deleted"
- [ ] Focus management after deletion
- [ ] Custom modal with better ARIA labels
- [ ] Keyboard shortcut hints

---

## Mobile Experience

### Touch Target
- Delete button is 44x44px minimum (touch-friendly)
- Larger spacing between cards on mobile
- Confirmation dialog is full-width on small screens

### Layout
```
Mobile (< 768px):
┌─────────────┐
│ [wireframe] │
│ 🎨 Branded 🗑│
│             │
│ Product     │
│ Launch 2024 │
└─────────────┘
┌─────────────┐
│  [styled]   │
│ 🎨 Branded 🗑│
│             │
│ Sales       │
│ Enablement  │
└─────────────┘
```

---

## Error Messages

### Network Error
```
╔═══════════════════════════════════════════╗
║  Error                               [X] ║
╟───────────────────────────────────────────╢
║  Failed to delete one-pager.             ║
║  Please try again.                       ║
║                                          ║
║                  [OK]                    ║
╚═══════════════════════════════════════════╝
```

### Unauthorized (401)
```
→ Automatic redirect to /login
→ User must log in again
```

### Forbidden (403)
```
╔═══════════════════════════════════════════╗
║  Error                               [X] ║
╟───────────────────────────────────────────╢
║  You don't have permission to delete     ║
║  this one-pager.                         ║
║                                          ║
║                  [OK]                    ║
╚═══════════════════════════════════════════╝
```

---

## Testing Checklist

```
[ ] Delete button appears on all cards
[ ] Click delete → Confirmation dialog shows
[ ] Cancel → Nothing happens
[ ] OK → Card is deleted
[ ] Dashboard refreshes automatically
[ ] Loading spinner shows during deletion
[ ] Delete button is disabled during deletion
[ ] Clicking card still navigates (delete doesn't block)
[ ] Multiple sequential deletes work
[ ] Delete last card → Shows empty state
[ ] Error handling works (network failure)
[ ] 401 redirects to login
[ ] 403 shows error message
```

---

## Quick Tips

### For Developers
1. **Hook is reusable** - Use `useOnePagerDelete()` anywhere
2. **Cache auto-updates** - No manual state management needed
3. **Error handling built-in** - Automatic 401 redirect
4. **Loading states included** - Use `isPending` for UI feedback

### For Users
1. **Always confirm** - Prevents accidental deletions
2. **Immediate feedback** - Spinner shows during deletion
3. **Auto-refresh** - Dashboard updates automatically
4. **No undo** - Be sure before confirming!

---

## Related Files

```
frontend/src/
├── hooks/
│   └── useOnePagerDelete.ts        ← Hook implementation
├── pages/
│   └── DashboardPage.tsx           ← UI integration
└── types/
    └── onepager.types.ts           ← Type definitions

backend/
└── onepagers/
    └── routes.py                   ← DELETE endpoint
```

---

## Summary

**Feature:** Delete one-pagers from dashboard  
**UI:** Trash icon (🗑️) on each card  
**Confirmation:** Native browser dialog  
**Loading:** Spinner on button during deletion  
**Feedback:** Card disappears immediately after success  
**Error Handling:** Alert on failure, redirect on 401  

**Status:** ✅ Ready to use!
