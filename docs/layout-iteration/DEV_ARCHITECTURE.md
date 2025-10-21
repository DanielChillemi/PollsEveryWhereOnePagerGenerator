<!--
文件：docs/layout-iteration/DEV_ARCHITECTURE.md
用途：Layout Iteration功能的架构设计说明
创建日期：2025-01-18
最后更新：2025-01-18
-->

# Layout Iteration 功能架构设计

## 📋 目录
1. [系统概览](#系统概览)
2. [数据架构](#数据架构)
3. [后端架构](#后端架构)
4. [前端架构](#前端架构)
5. [数据流](#数据流)
6. [关键技术决策](#关键技术决策)

---

## 系统概览

### 核心问题
当前系统只能迭代内容（文字），无法迭代设计（布局、样式），不符合项目需求。

### 解决方案
扩展系统，让AI在迭代时同时优化内容和设计参数，并提供Wireframe低保真预览。

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户界面层                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │ Wireframe    │   │ Preview      │   │ Design       │  │
│  │ Preview      │   │ Mode         │   │ Control      │  │
│  │              │   │              │   │ Panel        │  │
│  └──────────────┘   └──────────────┘   └──────────────┘  │
│         ↓                  ↓                  ↓           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      React Query层                          │
│  (useOnePager, useUpdateLayout, useSuggestLayout)          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                        API层                                │
│  POST /onepagers/{id}/refine                               │
│  POST /onepagers/{id}/suggest-layout                       │
│  POST /onepagers/{id}/export-pdf                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      业务逻辑层                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │ AI Service   │   │ PDF Service  │   │ OnePager     │  │
│  │              │   │              │   │ Service      │  │
│  └──────────────┘   └──────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓                   ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据层                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  MongoDB - onepagers collection                      │ │
│  │  {                                                    │ │
│  │    content: {...},                                    │ │
│  │    layout_params: {...},  ← 新增                     │ │
│  │    design_rationale: "..."  ← 新增                   │ │
│  │  }                                                    │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│                   外部服务                                   │
│  ┌──────────────┐   ┌──────────────┐                      │
│  │ OpenAI       │   │ Playwright   │                      │
│  │ GPT-4        │   │ (PDF生成)    │                      │
│  └──────────────┘   └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 数据架构

### 核心数据模型

#### LayoutParams（新增）
```python
{
  "color_scheme": {
    "primary": "#1568B8",
    "secondary": "#864CBD",
    "accent": "#FF6B6B",
    "text_primary": "#1A202C",
    "background": "#FFFFFF"
  },
  "typography": {
    "heading_font": "Inter",
    "body_font": "Inter",
    "h1_scale": 1.0,        # 0.8-1.5
    "h2_scale": 1.0,        # 0.8-1.5
    "body_scale": 1.0,      # 0.8-1.3
    "line_height_scale": 1.0  # 0.8-1.4
  },
  "spacing": {
    "section_gap": "normal",  # tight|normal|loose
    "padding_scale": 1.0      # 0.5-2.0
  },
  "section_layouts": {
    "features": {
      "columns": 2,           # 1|2|3
      "alignment": "left"     # left|center|right
    },
    "benefits": {
      "columns": 1,
      "alignment": "center"
    }
  }
}
```

#### OnePager（扩展）
```python
{
  "_id": ObjectId("..."),
  "user_id": "...",
  "title": "...",
  "content": {
    "headline": "...",
    "subheadline": "...",
    "problem": "...",
    "solution": "...",
    "features": [...],
    "benefits": [...],
    "social_proof": "...",
    "cta": {"text": "...", "url": "..."}
  },
  "brand_kit_id": "...",
  "template": "minimalist",

  # ✨ 新增字段
  "layout_params": {...},     # LayoutParams对象，可选
  "design_rationale": "...",  # AI的设计理由，可选

  "version": 3,
  "version_history": [
    {
      "version": 2,
      "content": {...},
      "layout_params": {...},  # ✨ 版本历史也保存layout
      "timestamp": "...",
      "feedback": "..."
    }
  ],
  "created_at": "...",
  "updated_at": "..."
}
```

### 数据库变更

#### 迁移策略
1. **新字段为可选**：layout_params和design_rationale都是Optional
2. **默认值注入**：迁移脚本为现有数据添加默认layout_params
3. **版本历史扩展**：新的版本快照包含layout_params
4. **向后兼容**：如果layout_params为None，使用默认值

#### 索引策略
无需新增索引，现有的user_id索引足够。

---

## 后端架构

### 目录结构（新增文件）

```
backend/
├── models/
│   └── onepager.py             # ✨ 添加LayoutParams类
│
├── services/
│   └── ai_service.py           # ✨ 增强AI服务
│
├── templates/pdf/
│   ├── minimalist.html         # 现有
│   └── minimalist_v2.html      # ✨ 新增参数化版本
│
├── onepagers/
│   └── routes.py               # ✨ 扩展endpoints
│
└── scripts/
    └── migrate_layout_params.py  # ✨ 迁移脚本
```

### AI服务架构

#### 方法扩展

```python
class AIService:

    # 现有方法（保留）
    async def refine_onepager(
        self,
        current_content: dict,
        user_feedback: str
    ) -> dict:
        """只优化内容"""
        pass

    # ✨ 新增方法
    async def refine_onepager_with_design(
        self,
        current_content: dict,
        current_layout: dict,
        user_feedback: str,
        brand_kit: dict
    ) -> dict:
        """同时优化内容和设计"""
        return {
            "content": {...},
            "layout_params": {...},
            "design_rationale": "..."
        }

    # ✨ 新增方法
    async def suggest_layout(
        self,
        content: dict,
        current_layout: dict,
        brand_kit: dict
    ) -> dict:
        """仅返回布局建议（不改内容）"""
        return {
            "layout_params": {...},
            "rationale": "..."
        }
```

#### AI Prompt策略

**System Prompt关键内容**：
- AI角色定位：专业设计师 + 文案撰写者
- 品牌指南约束（Brand Kit）
- 设计原则（visual hierarchy、scanability等）
- 布局参数约束（范围限制）
- 输出JSON格式要求

**User Prompt关键内容**：
- 当前内容和布局
- 内容特征分析（feature数量等）
- 用户反馈
- 设计意图推断

**响应格式**：
```json
{
  "content": {...},
  "layout_params": {...},
  "design_rationale": "详细的设计决策说明"
}
```

### PDF模板参数化

#### CSS变量注入

```html
<style>
:root {
  /* 颜色 */
  --color-primary: {{ layout_params.color_scheme.primary }};

  /* 字体缩放 */
  --scale-h1: {{ layout_params.typography.h1_scale }};

  /* 间距 */
  {% if layout_params.spacing.section_gap == 'tight' %}
    --gap-section: 2rem;
  {% elif layout_params.spacing.section_gap == 'loose' %}
    --gap-section: 6rem;
  {% else %}
    --gap-section: 4rem;
  {% endif %}
}

h1 {
  font-size: calc(3.5rem * var(--scale-h1));
  color: var(--color-primary);
}

.section {
  margin-bottom: var(--gap-section);
}
</style>
```

#### 动态Grid布局

```html
<div class="features-grid" style="
  grid-template-columns: repeat(
    {{ layout_params.section_layouts.features.columns }},
    1fr
  );
  text-align: {{ layout_params.section_layouts.features.alignment }};
">
  {% for feature in content.features %}
    <div class="feature-card">{{ feature }}</div>
  {% endfor %}
</div>
```

---

## 前端架构

### 目录结构（新增文件）

```
frontend/src/
├── types/
│   └── onepager.ts             # ✨ 添加LayoutParams接口
│
├── hooks/
│   └── useOnePager.ts          # ✨ 添加新hooks
│
├── components/onepager/
│   ├── WireframePreview.tsx    # ✨ 新增
│   ├── DesignControlPanel.tsx  # ✨ 新增
│   └── OnePagerEditor.tsx      # 现有（不变）
│
├── pages/onepager/steps/
│   └── RefineStep.tsx          # ✨ 扩展
│
└── utils/
    └── asciiGenerator.ts       # ✨ 新增
```

### 组件架构

#### RefineStep组件层次

```
RefineStep
├── ViewModeToggle（Wireframe ↔ Preview）
├── Left Panel (2/3宽度)
│   ├── WireframePreview（Wireframe模式）
│   │   └── 显示低保真布局预览
│   ├── OnePagerEditor（Preview模式）
│   │   └── 显示高保真预览
│   └── FeedbackPanel
│       └── 用户反馈输入
└── Right Panel (1/3宽度)
    ├── DesignControlPanel
    │   ├── Spacing Tab
    │   ├── Typography Tab
    │   └── Layout Tab
    └── AI Design Rationale Display
```

#### WireframePreview组件

**功能**：
- 显示OnePager的低保真结构预览
- 用灰色方块代表文字占位
- 用虚线边框标记section
- 实时响应layout_params变化

**输入**：
- onepager: OnePager对象
- layoutParams: LayoutParams对象

**输出**：
- 可视化的布局结构

**性能优化**：
- 使用React.memo避免不必要的重渲染
- 使用useMemo缓存计算

#### DesignControlPanel组件

**功能**：
- 提供UI控件调整布局参数
- 实时预览（通过回调通知父组件）
- 请求AI设计建议
- 应用/重置更改

**状态管理**：
```typescript
const [localLayout, setLocalLayout] = useState<LayoutParams>(currentLayout);
const [hasChanges, setHasChanges] = useState(false);
```

**数据流**：
```
用户拖动滑块
  → setLocalLayout(新值)
  → setHasChanges(true)
  → onLayoutChange(新值)  // 回调通知父组件
  → 父组件更新WireframePreview
```

**点击Apply**：
```
点击Apply
  → updateMutation.mutate({onePagerId, layoutParams})
  → API调用成功
  → React Query自动更新缓存
  → 组件重新渲染
  → setHasChanges(false)
```

### 状态管理策略

#### React Query缓存策略

```typescript
// OnePager数据缓存
queryKey: ['onepager', onePagerId]
staleTime: 30000  // 30秒内不重新请求
cacheTime: 300000 // 5分钟后清除缓存

// 更新策略
onSuccess: () => {
  queryClient.invalidateQueries(['onepager', onePagerId]);
}
```

#### 本地状态管理

- WireframePreview：无本地状态（完全受控组件）
- DesignControlPanel：本地状态存临时修改，Apply时提交

---

## 数据流

### 完整迭代流程

```
1. 用户进入RefineStep
   ↓
2. 加载OnePager数据（包含layout_params）
   ↓
3. 默认显示Wireframe模式
   ↓
4. 用户调整设计参数（拖动滑块）
   ↓
5. WireframePreview实时更新（本地预览）
   ↓
6. 用户点击"Apply Changes"
   ↓
7. 调用 PATCH /onepagers/{id}
   ↓
8. 后端更新数据库
   ↓
9. React Query更新缓存
   ↓
10. 组件重新渲染（显示保存后的状态）
```

### AI建议流程

```
1. 用户点击"Ask AI for Suggestion"
   ↓
2. 调用 POST /onepagers/{id}/suggest-layout
   ↓
3. 后端调用AI服务
   ├── 分析当前内容
   ├── 分析当前布局
   └── 生成建议
   ↓
4. AI返回{layout_params, rationale}
   ↓
5. 前端显示设计理由（Toast）
   ↓
6. 前端更新本地layout状态
   ↓
7. WireframePreview更新预览
   ↓
8. 用户检查并决定是否Apply
```

### AI迭代流程（用户反馈）

```
1. 用户在FeedbackPanel输入反馈："更紧凑，feature用2列"
   ↓
2. 调用 POST /onepagers/{id}/refine
   ↓
3. 后端调用 refine_onepager_with_design()
   ├── AI分析反馈
   ├── 优化内容（headline等）
   └── 优化布局（spacing→tight, features.columns→2）
   ↓
4. AI返回{content, layout_params, design_rationale}
   ↓
5. 后端保存版本快照（包含layout_params）
   ↓
6. 后端更新OnePager数据
   ↓
7. 前端接收更新
   ├── 显示新内容
   ├── 显示新布局
   └── 显示设计理由
   ↓
8. 用户继续迭代或进入Export步骤
```

### PDF导出流程

```
1. 用户点击"Export PDF"
   ↓
2. 调用 POST /onepagers/{id}/export-pdf
   ↓
3. 后端获取OnePager（包含layout_params）
   ↓
4. 选择模板（minimalist_v2.html）
   ↓
5. Jinja2渲染模板
   ├── 注入content
   └── 注入layout_params（CSS变量）
   ↓
6. Playwright生成PDF
   ↓
7. 返回PDF文件给用户
```

---

## 关键技术决策

### 决策1：参数化模板 vs 动态布局引擎

**选择**：参数化模板（方案B）
**理由**：
- 开发时间可控（7天）
- 质量有保障（保留专业设计）
- 可扩展性足够

**替代方案**：
- 动态布局引擎（方案C）：工程量太大（80-100h）

---

### 决策2：Wireframe预览实现方式

**选择**：React组件渲染（方案3：Figma-style）
**理由**：
- 视觉效果最好
- 用户体验专业
- 实时更新流畅

**替代方案**：
- 纯ASCII（方案2）：视觉效果差，但作为导出功能保留
- CSS Wireframe（方案1）：折中方案，暂不实施

---

### 决策3：状态管理策略

**选择**：React Query + 本地useState
**理由**：
- React Query处理服务器状态（OnePager数据）
- useState处理UI状态（临时修改）
- 清晰的状态边界

**替代方案**：
- Redux：过于复杂，不需要全局状态
- Zustand：不需要跨组件共享状态

---

### 决策4：向后兼容策略

**选择**：可选字段 + 默认值
**理由**：
- 不破坏现有数据
- 迁移安全
- 可随时回滚

**实施**：
- layout_params字段Optional
- 读取时如果为None，使用默认值
- 版本历史也记录layout_params

---

### 决策5：AI Prompt策略

**选择**：结构化Prompt + JSON输出
**理由**：
- 明确的输出格式
- 易于验证和解析
- 设计约束清晰

**风险缓解**：
- Schema验证：Pydantic验证输出
- Fallback机制：如果无效，使用默认值
- 日志记录：记录AI原始响应

---

## 非功能性需求

### 性能要求

| 指标 | 要求 | 实现方式 |
|------|------|---------|
| API响应时间 | <2s (p95) | AI调用timeout 10s |
| Wireframe更新 | 60fps | React.memo + useMemo |
| PDF生成时间 | <5s | 优化模板大小 |
| 首屏加载 | <1s | 代码分割 |

### 可靠性要求

| 场景 | 要求 | 实现方式 |
|------|------|---------|
| AI服务失败 | 不影响核心功能 | 使用默认值 + 提示用户 |
| 数据库迁移失败 | 可回滚 | 完整备份 + 回滚脚本 |
| PDF生成失败 | 友好错误提示 | try-catch + 用户提示 |

### 可维护性要求

- **代码注释**：所有新代码有docstring
- **文档完整**：API文档、架构文档、使用文档
- **测试覆盖**：单元测试>90%，E2E测试覆盖主流程

---

## 安全性考虑

### 输入验证
- 前端：TypeScript类型检查
- 后端：Pydantic schema验证
- 范围检查：h1_scale限制在0.8-1.5

### 权限控制
- 用户只能修改自己的OnePager
- API endpoint使用get_current_user依赖

### 数据备份
- 迁移前完整备份
- 版本历史机制（可回滚到任意版本）

---

**文档版本**：v1.0
**最后更新**：2025-01-18
**维护者**：Claude AI + Anthony
