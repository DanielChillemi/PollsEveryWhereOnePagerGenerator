# Page Layout Visual Guide - ASCII Diagrams

**For Marketing One-Pager Co-Creation Tool**  
Visual reference for proper page structure and centering

---

## 📐 Form Pages (Brand Kit Create/Edit, Authentication)

### ✅ CORRECT: Centered Form with Gradient Header

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW (100% width)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║          GRADIENT HEADER (linear-gradient purple → blue)             ║  │
│  ║  ┌─────────────────────────────────────────────────────────────┐     ║  │
│  ║  │          Container maxW="1200px" (centered)                 │     ║  │
│  ║  │  ┌───────────────────────────────────────────────────┐     │     ║  │
│  ║  │  │  Create Your Brand Kit                           │     │     ║  │
│  ║  │  │  Define your brand identity to power AI...       │     │     ║  │
│  ║  │  └───────────────────────────────────────────────────┘     │     ║  │
│  ║  └─────────────────────────────────────────────────────────────┘     ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
│         ┌────────────────────────────────────────────────────────┐          │
│         │  Container maxW="900px" px={{ base: 4, md: 8 }}       │          │
│         │  ┌──────────────────────────────────────────────┐     │          │
│         │  │ Box maxW="800px" mx="auto" (centered)        │     │          │
│         │  │ ┌──────────────────────────────────────────┐ │     │          │
│         │  │ │   WHITE FORM CARD (bg="white")          │ │     │          │
│         │  │ │   p={{ base: 6, md: 10 }}               │ │     │          │
│         │  │ │   borderRadius="16px"                    │ │     │          │
│         │  │ │                                          │ │     │          │
│         │  │ │   Company Information                    │ │     │          │
│         │  │ │   ┌────────────────────────────────────┐ │ │     │          │
│         │  │ │   │ Company Name *                     │ │ │     │          │
│         │  │ │   │ [Input field 56px height]          │ │ │     │          │
│         │  │ │   └────────────────────────────────────┘ │ │     │          │
│         │  │ │                                          │ │     │          │
│         │  │ │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │     │          │
│         │  │ │                                          │ │     │          │
│         │  │ │   Brand Colors                           │ │     │          │
│         │  │ │   ┌────────────────────────────────────┐ │ │     │          │
│         │  │ │   │ Primary Color                      │ │ │     │          │
│         │  │ │   │ [■ Color picker] [#FFFFFF]         │ │ │     │          │
│         │  │ │   └────────────────────────────────────┘ │ │     │          │
│         │  │ │                                          │ │     │          │
│         │  │ │   [ Create Brand Kit ]                   │ │     │          │
│         │  │ └──────────────────────────────────────────┘ │     │          │
│         │  └──────────────────────────────────────────────┘     │          │
│         └────────────────────────────────────────────────────────┘          │
│                                                                              │
│                           (gray background)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
    ↑                                                                       ↑
Padding scales:                                                    Padding scales:
base: 16px (mobile)                                                base: 16px
md: 32px (tablet+)                                                 md: 32px
```

**Key Measurements:**
- Outer Container: 900px max-width (allows padding)
- Inner Form Box: 800px max-width + `mx="auto"` (centers horizontally)
- Form padding: 24px (base) → 40px (md) responsive
- Input heights: 56px for optimal touch targets
- Section spacing: 40px vertical gaps

---

### ❌ WRONG: Left-Aligned Form (What was happening)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW (100% width)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║          GRADIENT HEADER                                             ║  │
│  ║  Create Your Brand Kit                                               ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ WHITE FORM CARD (stretches full width - NO maxW)                      │ │
│  │ ┌────────────────────────────────────────────────────────────────────┐│ │
│  │ │ Company Information                                                ││ │
│  │ │ ┌────────────────────────────────────────────────────────────────┐││ │
│  │ │ │ Company Name                  (form is way too wide!)          │││ │
│  │ │ │ [Input stretches across entire width ─────────────────────────]│││ │
│  │ │ └────────────────────────────────────────────────────────────────┘││ │
│  │ │                                                                    ││ │
│  │ │ Brand Colors                                                       ││ │
│  │ └────────────────────────────────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  ↑                                                                           │
│  No Container = content hugs left edge, stretches too wide                  │
│  No mx="auto" = no centering                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Problems:**
- ❌ No Container wrapper → content stretches full viewport width
- ❌ No `maxW="800px"` → forms too wide (>1000px), hard to read
- ❌ No `mx="auto"` → content aligns to left edge
- ❌ No responsive padding → breaks on mobile

---

## 📊 Content/List Pages (Dashboard, Brand Kit List)

### ✅ CORRECT: Full-Width Container with Grid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW (100% width)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│      ┌────────────────────────────────────────────────────────────┐         │
│      │   Container maxW="1200px" px={{ base: 4, md: 8 }}         │         │
│      │   ┌────────────────────────────────────────────────────┐   │         │
│      │   │  My Brand Kits                                     │   │         │
│      │   └────────────────────────────────────────────────────┘   │         │
│      │                                                            │         │
│      │   ┌───────────┐  ┌───────────┐  ┌───────────┐            │         │
│      │   │  CARD 1   │  │  CARD 2   │  │  CARD 3   │            │         │
│      │   │           │  │           │  │           │            │         │
│      │   │ Acme Inc  │  │ TechCo    │  │ StartUp   │            │         │
│      │   │ ■■■■■     │  │ ■■■■■     │  │ ■■■■■     │            │         │
│      │   │ [Edit]    │  │ [Edit]    │  │ [Edit]    │            │         │
│      │   └───────────┘  └───────────┘  └───────────┘            │         │
│      │                                                            │         │
│      │   ┌───────────┐  ┌───────────┐  ┌───────────┐            │         │
│      │   │  CARD 4   │  │  CARD 5   │  │  + NEW    │            │         │
│      │   │           │  │           │  │           │            │         │
│      │   │ Agency X  │  │ Brand Y   │  │ Create    │            │         │
│      │   │ ■■■■■     │  │ ■■■■■     │  │ Brand Kit │            │         │
│      │   │ [Edit]    │  │ [Edit]    │  │           │            │         │
│      │   └───────────┘  └───────────┘  └───────────┘            │         │
│      │                                                            │         │
│      └────────────────────────────────────────────────────────────┘         │
│                       (gray.50 background)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
    ↑                                                                  ↑
Padding                                                        Padding
16px mobile                                                    16px mobile
32px tablet+                                                   32px tablet+
```

**Key Features:**
- Container maxW="1200px" (wider for multiple columns)
- Content goes directly in Container (no inner Box)
- SimpleGrid with responsive columns: `{ base: 1, md: 2, lg: 3 }`
- Cards have consistent spacing with `gap={6}`
- Background: `bg="gray.50"` for visual depth

---

## 📈 Dashboard Pages (Data-Heavy)

### ✅ CORRECT: Wide Container for Data Density

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW (100% width)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    ┌──────────────────────────────────────────────────────────────┐         │
│    │  Container maxW="1400px" px={{ base: 4, md: 8 }}            │         │
│    │  ┌────────────────────────────────────────────────────────┐  │         │
│    │  │  Dashboard                                             │  │         │
│    │  └────────────────────────────────────────────────────────┘  │         │
│    │                                                              │         │
│    │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │         │
│    │  │  STAT CARD   │ │  STAT CARD   │ │  STAT CARD   │        │         │
│    │  │              │ │              │ │              │        │         │
│    │  │   5 Kits     │ │   12 Pages   │ │   8 Exports  │        │         │
│    │  │   Created    │ │   Generated  │ │   This Week  │        │         │
│    │  └──────────────┘ └──────────────┘ └──────────────┘        │         │
│    │                                                              │         │
│    │  ┌──────────────────────────────────────────────────────┐   │         │
│    │  │  Recent Activity                                      │   │         │
│    │  │  ┌────────────────────────────────────────────────┐  │   │         │
│    │  │  │ Date       │ Action       │ Brand Kit │ Status │  │   │         │
│    │  │  ├────────────────────────────────────────────────┤  │   │         │
│    │  │  │ 10/7/2025  │ Created Kit  │ Acme Inc  │ ✓      │  │   │         │
│    │  │  │ 10/6/2025  │ Exported PDF │ TechCo    │ ✓      │  │   │         │
│    │  │  │ 10/5/2025  │ Updated Kit  │ StartUp   │ ✓      │  │   │         │
│    │  │  └────────────────────────────────────────────────┘  │   │         │
│    │  └──────────────────────────────────────────────────────┘   │         │
│    │                                                              │         │
│    └──────────────────────────────────────────────────────────────┘         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Container maxW="1400px" (widest for data tables)
- Supports 3-4 column layouts comfortably
- Stat cards in HStack or SimpleGrid
- Data tables with proper spacing
- No inner centering - content uses full container width

---

## 🎨 Smart Canvas (Design Workspace)

### ✅ CORRECT: Full-Width with Section Containers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BROWSER WINDOW (100% width)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  TOOLBAR (full width)                                               │    │
│  │  [Wireframe] [Styled] [Export PDF] [AI Coach]                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║  HEADER SECTION (full viewport width, bg color)                      ║  │
│  ║  ┌───────────────────────────────────────────────────────────┐       ║  │
│  ║  │  Container maxW="6xl" (centered within section)           │       ║  │
│  ║  │  ┌─────────────────────────────────────────────────────┐  │       ║  │
│  ║  │  │  Your Company Name                                  │  │       ║  │
│  ║  │  │  Tagline goes here                                  │  │       ║  │
│  ║  │  └─────────────────────────────────────────────────────┘  │       ║  │
│  ║  └───────────────────────────────────────────────────────────┘       ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║  HERO SECTION (full viewport width, different bg)                    ║  │
│  ║  ┌───────────────────────────────────────────────────────────┐       ║  │
│  ║  │  Container maxW="6xl"                                     │       ║  │
│  ║  │  ┌─────────────────────────────────────────────────────┐  │       ║  │
│  ║  │  │  Headline Goes Here                                 │  │       ║  │
│  ║  │  │  Value proposition text...                          │  │       ║  │
│  ║  │  │  [Call to Action Button]                            │  │       ║  │
│  ║  │  └─────────────────────────────────────────────────────┘  │       ║  │
│  ║  └───────────────────────────────────────────────────────────┘       ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║  FEATURES SECTION (full viewport width)                              ║  │
│  ║  ┌───────────────────────────────────────────────────────────┐       ║  │
│  ║  │  Container maxW="6xl"                                     │       ║  │
│  ║  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                   │       ║  │
│  ║  │  │Feature 1│  │Feature 2│  │Feature 3│                   │       ║  │
│  ║  │  └─────────┘  └─────────┘  └─────────┘                   │       ║  │
│  ║  └───────────────────────────────────────────────────────────┘       ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
     ↑                                                                    ↑
NO page-level Container!                                        Each section has
Sections span full width                                        its own Container
for design flexibility                                          maxW="6xl"
```

**Key Features:**
- **NO** page-level Container wrapper
- Each section spans full viewport width (for background colors/images)
- Individual sections have `Container maxW="6xl"` for content
- VStack with `spacing={0}` and `align="stretch"` for section stacking
- Allows design flexibility with full-width backgrounds

---

## 📱 Responsive Behavior

### Mobile (< 768px)

```
┌───────────────────────┐
│   MOBILE BROWSER      │
├───────────────────────┤
│ ╔═══════════════════╗ │
│ ║  GRADIENT HEADER  ║ │
│ ║  Title            ║ │
│ ╚═══════════════════╝ │
│                       │
│ ┌─────────────────┐   │
│ │ Form Container  │   │
│ │ px={4} (16px)   │   │
│ │ ┌─────────────┐ │   │
│ │ │ Form Card   │ │   │
│ │ │ p={6} (24px)│ │   │
│ │ │             │ │   │
│ │ │ Company *   │ │   │
│ │ │ [──────────]│ │   │
│ │ │             │ │   │
│ │ │ Colors      │ │   │
│ │ │ [■] [#FFF] │ │   │
│ │ │             │ │   │
│ │ │  [Button]   │ │   │
│ │ └─────────────┘ │   │
│ └─────────────────┘   │
│                       │
└───────────────────────┘
```

**Mobile Adaptations:**
- Container padding: `px={4}` = 16px
- Form card padding: `p={6}` = 24px
- Inputs stack vertically
- Color picker adapts to narrower width
- Buttons become full-width

### Tablet (768px - 1024px)

```
┌─────────────────────────────────────┐
│       TABLET BROWSER                │
├─────────────────────────────────────┤
│ ╔═══════════════════════════════╗   │
│ ║     GRADIENT HEADER           ║   │
│ ║     Title                     ║   │
│ ╚═══════════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐     │
│   │ Container px={8} (32px)   │     │
│   │  ┌─────────────────────┐  │     │
│   │  │ Form Card           │  │     │
│   │  │ p={10} (40px)       │  │     │
│   │  │                     │  │     │
│   │  │ Company Name *      │  │     │
│   │  │ [────────────────]  │  │     │
│   │  │                     │  │     │
│   │  │ Primary Color       │  │     │
│   │  │ [■■] [#FFFFFF───]   │  │     │
│   │  │                     │  │     │
│   │  │    [Button]         │  │     │
│   │  └─────────────────────┘  │     │
│   └───────────────────────────┘     │
│                                     │
└─────────────────────────────────────┘
```

**Tablet Adaptations:**
- Container padding: `px={8}` = 32px
- Form card padding: `p={10}` = 40px
- More horizontal space for labels + inputs
- Color picker elements have more breathing room

---

## 🎯 Width Constraint Rationale

### Why 800px for Forms?

```
┌────────────────────────────────────────────────────────────┐
│  800px = Optimal Form Width                                │
│                                                            │
│  Research shows:                                           │
│  • 60-80 characters per line = optimal readability         │
│  • 16px font × 80 chars ≈ 800px                           │
│  • Forms wider than 1000px = harder to scan                │
│  • Labels + inputs side-by-side needs 700-900px           │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Company Name *                                     │   │
│  │ [─────────────────────────────────────────────────]│   │
│  │ ↑                                                  ↑   │
│  │ Label                                    Input fills   │
│  │ 150px                                    600px space   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Why 900px Container?

```
┌──────────────────────────────────────────────────────────────┐
│  900px Container = Padding + 800px Form                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 50px padding │  800px form  │ 50px padding             │ │
│  │──────────────┼──────────────┼──────────────            │ │
│  │              │ Form content │                           │ │
│  │              │ centered     │                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Formula: maxW="900px" on Container                          │
│           + maxW="800px" + mx="auto" on inner Box           │
│           = Perfectly centered form with breathing room     │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔄 Before & After Comparison

### BEFORE (Wrong)

```
Browser: ┌───────────────────────────────────────────────────────┐
         │[Form stretches full width────────────────────────────]│
         │ Content hugs left edge →                             │
         │ Hard to read, unprofessional                         │
         └───────────────────────────────────────────────────────┘
```

### AFTER (Correct)

```
Browser: ┌───────────────────────────────────────────────────────┐
         │              ┌────────────────┐                       │
         │              │  Centered Form │                       │
         │              │  Easy to read  │                       │
         │              └────────────────┘                       │
         │    Balanced white space      Balanced white space    │
         └───────────────────────────────────────────────────────┘
```

---

## 📚 Quick Reference Table

| Page Type | Outer Container | Inner Box | Use Case |
|-----------|----------------|-----------|----------|
| **Form** | 900px + px responsive | 800px + mx="auto" | Brand Kit Create/Edit, Auth |
| **Content** | 1200px + px responsive | ❌ No inner box | Brand Kit List, Settings |
| **Dashboard** | 1400px + px responsive | ❌ No inner box | Analytics, Stats |
| **Canvas** | ❌ No container | Per-section 6xl | Smart Canvas Editor |

---

## ✅ Checklist for Developers

When creating a new page, ask:

1. **Is this a form page?**
   - ✅ YES → Use 900px Container + 800px centered Box
   - ❌ NO → Continue to #2

2. **Does it show a list/grid of items?**
   - ✅ YES → Use 1200px Container, no inner Box
   - ❌ NO → Continue to #3

3. **Is it a data dashboard?**
   - ✅ YES → Use 1400px Container for density
   - ❌ NO → Continue to #4

4. **Is it a design canvas/editor?**
   - ✅ YES → No page Container, per-section 6xl
   - ❌ NO → Default to 1200px Container

**Always include:**
- ✅ `px={{ base: 4, md: 8 }}` responsive padding
- ✅ `py` vertical padding (8, 12, or 16)
- ✅ `minH="100vh"` on outer Box
- ✅ Proper background colors (gray.50 for content, white for forms)

---

**Created**: October 7, 2025  
**Purpose**: Visual guide for consistent page layouts across the marketing one-pager tool  
**Target Audience**: Developers, AI assistants, UX designers
