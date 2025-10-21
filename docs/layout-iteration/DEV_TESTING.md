<!--
文件：docs/layout-iteration/DEV_TESTING.md
用途：Layout Iteration功能的测试清单
创建日期：2025-01-18
最后更新：2025-01-18
-->

# Layout Iteration 功能测试清单

## 📋 目录
1. [测试策略](#测试策略)
2. [单元测试](#单元测试)
3. [集成测试](#集成测试)
4. [E2E测试](#e2e测试)
5. [性能测试](#性能测试)
6. [手动测试](#手动测试)

---

## 测试策略

### 测试金字塔

```
        ╱╲
       ╱E2E╲          少量（1个主流程）
      ╱─────╲
     ╱集成测试╲        中量（5-8个场景）
    ╱─────────╲
   ╱  单元测试  ╲      大量（20+个用例）
  ╱─────────────╲
```

### 测试覆盖目标

| 层级 | 目标覆盖率 | 工具 |
|------|-----------|------|
| 单元测试 | >90% | pytest (后端), Jest (前端) |
| 集成测试 | 100% (主要流程) | pytest |
| E2E测试 | 100% (用户流程) | Playwright |

---

## 单元测试

### 后端单元测试

#### 文件：`tests/models/test_layout_params.py`

##### 测试用例清单

- [ ] **test_color_scheme_validation**
  - 测试有效的hex颜色格式
  - 测试无效的颜色格式（应拒绝）
  - 测试默认值

- [ ] **test_typography_range_validation**
  - 测试h1_scale在有效范围内（0.8-1.5）
  - 测试h1_scale超出范围（应拒绝）
  - 测试h2_scale范围
  - 测试body_scale范围
  - 测试line_height_scale范围

- [ ] **test_spacing_validation**
  - 测试section_gap只接受tight/normal/loose
  - 测试padding_scale范围（0.5-2.0）

- [ ] **test_section_layout_validation**
  - 测试columns只接受1/2/3
  - 测试alignment只接受left/center/right

- [ ] **test_layout_params_defaults**
  - 测试get_default_layout_params()返回正确默认值
  - 测试所有必需字段都有默认值

- [ ] **test_layout_params_json_serialization**
  - 测试dict()方法正确序列化
  - 测试json.dumps()正常工作
  - 测试json.loads()能反序列化

- [ ] **test_onepager_with_layout_params**
  - 测试OnePager模型接受layout_params
  - 测试layout_params为None时正常工作（向后兼容）

- [ ] **test_version_history_with_layout_params**
  - 测试版本快照包含layout_params

**运行命令**：
```bash
pytest tests/models/test_layout_params.py -v
```

**预期结果**：所有测试通过，覆盖率>90%

---

#### 文件：`tests/services/test_ai_service.py`

##### 测试用例清单

- [ ] **test_refine_with_design_basic**
  - 输入：当前内容、布局、用户反馈
  - 预期：返回{content, layout_params, design_rationale}
  - 验证：所有字段非空

- [ ] **test_refine_with_design_understands_compact_feedback**
  - 输入：反馈包含"compact"或"紧凑"
  - 预期：layout_params.spacing.section_gap为"tight"或"normal"

- [ ] **test_refine_with_design_understands_column_feedback**
  - 输入：反馈包含"2 columns"
  - 预期：features的columns=2

- [ ] **test_refine_with_design_respects_constraints**
  - 输入：AI可能建议超出范围的值
  - 预期：验证步骤将其修正到有效范围

- [ ] **test_suggest_layout_basic**
  - 输入：当前内容和布局
  - 预期：返回{layout_params, rationale}

- [ ] **test_ai_service_handles_invalid_json**
  - Mock：AI返回无效JSON
  - 预期：抛出合适的异常

- [ ] **test_ai_service_handles_api_failure**
  - Mock：OpenAI API失败
  - 预期：抛出异常并记录日志

**运行命令**：
```bash
pytest tests/services/test_ai_service.py -v
```

---

#### 文件：`tests/scripts/test_migration.py`

##### 测试用例清单

- [ ] **test_migration_adds_layout_params**
  - 准备：创建没有layout_params的OnePager
  - 执行：运行迁移脚本
  - 验证：OnePager有layout_params字段

- [ ] **test_migration_uses_default_values**
  - 验证：迁移后的layout_params与默认值一致

- [ ] **test_migration_preserves_existing_data**
  - 验证：迁移不改变title、content等现有字段

- [ ] **test_rollback_removes_layout_params**
  - 执行：运行回滚脚本
  - 验证：layout_params字段被删除

**运行命令**：
```bash
pytest tests/scripts/test_migration.py -v
```

---

### 前端单元测试

#### 文件：`frontend/src/components/onepager/__tests__/WireframePreview.test.tsx`

##### 测试用例清单

- [ ] **renders_hero_section**
  - 验证：Hero section可见

- [ ] **renders_features_with_correct_columns**
  - 输入：layout_params.section_layouts.features.columns = 2
  - 验证：grid-template-columns为2列

- [ ] **updates_when_layout_params_change**
  - 操作：改变spacing.section_gap
  - 验证：section间距更新

- [ ] **displays_layout_info_panel**
  - 验证：右上角信息面板显示

**运行命令**：
```bash
npm test WireframePreview
```

---

#### 文件：`frontend/src/components/onepager/__tests__/DesignControlPanel.test.tsx`

##### 测试用例清单

- [ ] **renders_all_tabs**
  - 验证：Spacing、Typography、Layout三个Tab存在

- [ ] **spacing_controls_work**
  - 操作：改变section间距下拉框
  - 验证：onChange回调被调用

- [ ] **typography_sliders_work**
  - 操作：拖动h1_scale滑块
  - 验证：值更新

- [ ] **apply_button_calls_mutation**
  - Mock：useUpdateLayout hook
  - 操作：点击Apply
  - 验证：mutation被调用

- [ ] **ask_ai_button_calls_suggest**
  - Mock：useSuggestLayout hook
  - 操作：点击"Ask AI"
  - 验证：mutation被调用

- [ ] **reset_button_restores_original**
  - 操作：修改参数 → 点击Reset
  - 验证：恢复到初始值

**运行命令**：
```bash
npm test DesignControlPanel
```

---

#### 文件：`frontend/src/utils/__tests__/asciiGenerator.test.ts`

##### 测试用例清单

- [ ] **generates_ascii_with_hero**
  - 输入：OnePager with headline
  - 验证：输出包含'═'（Hero边框）

- [ ] **generates_ascii_with_columns**
  - 输入：features.columns = 2
  - 验证：输出有2列布局

- [ ] **respects_section_gap**
  - 输入：spacing.section_gap = 'loose'
  - 验证：section之间有3个空行

**运行命令**：
```bash
npm test asciiGenerator
```

---

## 集成测试

### 文件：`tests/integration/test_layout_api.py`

##### 测试场景清单

- [ ] **test_refine_endpoint_updates_layout**
  - 创建OnePager
  - 调用POST /onepagers/{id}/refine with feedback
  - 验证：content更新 AND layout_params更新

- [ ] **test_suggest_layout_endpoint**
  - 创建OnePager
  - 调用POST /onepagers/{id}/suggest-layout
  - 验证：返回{layout_params, rationale}

- [ ] **test_export_pdf_uses_layout_params**
  - 创建OnePager with custom layout_params
  - 调用POST /onepagers/{id}/export-pdf
  - 验证：返回PDF文件
  - （暂不验证PDF内容，太复杂）

- [ ] **test_version_history_includes_layout**
  - 创建OnePager
  - 迭代2次（改变layout_params）
  - 验证：version_history包含layout_params

- [ ] **test_restore_version_restores_layout**
  - 创建OnePager
  - 迭代1次（改变layout）
  - 回滚到v1
  - 验证：layout恢复

**运行命令**：
```bash
pytest tests/integration/test_layout_api.py -v
```

---

## E2E测试

### 文件：`tests/e2e/test_layout_iteration_flow.py`

#### 完整用户流程测试

**测试场景**：用户从创建到导出的完整布局迭代流程

##### 步骤清单

- [ ] **Step 1: 用户创建OnePager**
  - 导航到 /onepager/create
  - 填写表单（title, problem, solution, features, cta）
  - 点击"Generate with AI"

- [ ] **Step 2: 进入Refine步骤**
  - 等待AI生成完成
  - 验证：URL变为 /onepager/create?id=XXX
  - 验证：显示"Refine"步骤标题

- [ ] **Step 3: 验证Wireframe模式是默认**
  - 验证："Structure (Wireframe)" tab被选中
  - 验证：Wireframe预览可见

- [ ] **Step 4: 验证Wireframe显示正确**
  - 验证：Hero section可见（带"HERO"标签）
  - 验证：Features section可见（带"FEATURES"标签）
  - 验证：CTA section可见

- [ ] **Step 5: 调整布局参数**
  - 点击"Layout" tab
  - 将features的columns改为3
  - 验证：Wireframe立即更新（3列）

- [ ] **Step 6: 调整间距**
  - 点击"Spacing" tab
  - 将section_gap改为"loose"
  - 验证：Wireframe section间距增大

- [ ] **Step 7: 应用更改**
  - 点击"Apply Changes"按钮
  - 验证：Toast显示"Layout Updated!"
  - 验证："Unsaved Changes"标记消失

- [ ] **Step 8: 请求AI建议**
  - 点击"Ask AI for Suggestion"
  - 验证：Toast显示设计理由
  - 验证：layout参数更新

- [ ] **Step 9: 切换到Preview模式**
  - 点击"Design (Preview)" tab
  - 验证：OnePagerEditor可见

- [ ] **Step 10: 导出ASCII**
  - 切换回"Structure (Wireframe)"
  - 点击"Export ASCII"按钮
  - 验证：文件下载
  - 验证：文件内容包含Box Drawing字符

- [ ] **Step 11: 提交反馈迭代**
  - 在FeedbackPanel输入："更紧凑一些"
  - 点击Submit
  - 验证：AI返回响应
  - 验证：spacing可能变为"tight"

- [ ] **Step 12: 进入Export步骤**
  - 点击"Next → Export PDF"
  - 验证：显示Export步骤

- [ ] **Step 13: 导出PDF**
  - 选择模板（minimalist）
  - 点击"Export PDF"
  - 验证：PDF文件下载

**运行命令**：
```bash
pytest tests/e2e/test_layout_iteration_flow.py -v --headed
```

**预计时间**：约2-3分钟

---

## 性能测试

### 响应时间测试

#### API性能要求

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| POST /refine | <1s | <2s | <3s |
| POST /suggest-layout | <1s | <2s | <3s |
| POST /export-pdf | <3s | <5s | <8s |

#### 测试方法

```python
# tests/performance/test_api_performance.py

import time

def test_refine_performance():
    """测试refine endpoint响应时间"""
    times = []
    for i in range(100):
        start = time.time()
        response = client.post(f'/onepagers/{onepager_id}/refine', json={...})
        elapsed = time.time() - start
        times.append(elapsed)

    p50 = sorted(times)[50]
    p95 = sorted(times)[95]

    assert p50 < 1.0, f"p50={p50}s, 期望<1s"
    assert p95 < 2.0, f"p95={p95}s, 期望<2s"
```

**运行命令**：
```bash
pytest tests/performance/ -v
```

---

### 前端性能测试

#### Wireframe渲染性能

**要求**：拖动滑块时保持60fps

**测试方法**：
```typescript
// 使用Chrome DevTools Performance Profiler
// 1. 打开DevTools → Performance
// 2. 开始录制
// 3. 快速拖动h1_scale滑块
// 4. 停止录制
// 5. 分析FPS图表

// 验收标准：
// - FPS应保持在55-60之间
// - 无明显的掉帧（红色标记）
// - 总渲染时间 <16ms（1帧）
```

---

## 手动测试

### 兼容性测试清单

#### 浏览器兼容性
- [ ] Chrome（最新版）
- [ ] Firefox（最新版）
- [ ] Safari（最新版）
- [ ] Edge（最新版）

#### 移动端测试
- [ ] iPhone Safari（响应式）
- [ ] Android Chrome（响应式）

---

### UI/UX测试清单

#### Wireframe预览
- [ ] 所有section正确显示
- [ ] 标签（HERO、FEATURES等）清晰可见
- [ ] 布局参数信息面板显示正确
- [ ] 间距变化清晰可见
- [ ] 列数变化清晰可见

#### 设计控制面板
- [ ] 所有Tab可点击切换
- [ ] 滑块拖动流畅
- [ ] 下拉框正常工作
- [ ] "Unsaved Changes"标记准确
- [ ] Apply按钮正确禁用/启用
- [ ] Reset按钮正确恢复

#### AI交互
- [ ] "Ask AI"按钮点击后显示loading
- [ ] Toast显示设计理由
- [ ] 设计理由文案有实质内容（非空话）

#### 错误处理
- [ ] AI服务失败时显示友好错误
- [ ] 网络错误时显示重试提示
- [ ] 无效输入时显示验证错误

---

### 回归测试清单

**确保新功能不破坏现有功能**：

- [ ] **现有的内容迭代仍然工作**
  - 用户可以提交反馈
  - AI优化内容
  - 版本历史正常

- [ ] **现有的PDF导出仍然工作**
  - 没有layout_params的OnePager能导出
  - PDF样式正常（不报错）

- [ ] **现有的OnePager列表页正常**
  - 显示所有OnePager
  - 卡片点击导航正确

- [ ] **现有的认证系统正常**
  - 登录/登出
  - 权限控制

---

## 测试数据准备

### 测试用OnePager模板

```json
{
  "title": "AI Task Automator",
  "problem": "Teams waste 40% of time on repetitive manual tasks that could be automated",
  "solution": "Our AI learns your workflows and automates them intelligently with natural language commands",
  "features": [
    "Smart Automation Engine",
    "Natural Language Commands",
    "Seamless Integrations",
    "Real-time Analytics Dashboard"
  ],
  "benefits": [
    "Save 10+ hours per week",
    "Reduce human errors by 90%",
    "Focus on creative work"
  ],
  "social_proof": "This tool saved our team 40% of manual work! - Sarah, Product Manager",
  "cta": {
    "text": "Start Free Trial",
    "url": "https://example.com/trial"
  }
}
```

### 测试用BrandKit

```json
{
  "name": "Demo Brand",
  "primary_color": "#1568B8",
  "secondary_color": "#864CBD",
  "font_family": "Inter",
  "tone": "Professional and friendly"
}
```

---

## 测试执行计划

### Day 6测试计划

**时间分配**（8小时）：
- 运行所有单元测试：1h
- 运行集成测试：1h
- 运行E2E测试：1h
- 修复发现的bug：3h
- 手动测试：1h
- 性能测试：1h

### 测试通过标准

**可以进入Day 7（Demo准备）的条件**：
- ✅ 所有单元测试通过率 >95%
- ✅ 所有集成测试通过
- ✅ E2E测试完整流程通过
- ✅ 无critical bug
- ✅ 性能指标达标

---

## Bug追踪模板

**发现bug时记录**：

```markdown
## Bug #001

**发现时间**：2025-01-XX
**发现人**：Anthony / Claude
**优先级**：High / Medium / Low
**类型**：功能 / 性能 / UI

**描述**：
（简短描述bug）

**重现步骤**：
1. ...
2. ...
3. ...

**预期行为**：
（应该怎样）

**实际行为**：
（实际怎样）

**截图/日志**：
（如果有）

**状态**：Open / In Progress / Fixed / Wontfix

**修复方案**：
（如何修复）

**修复人**：
**修复时间**：
**验证人**：
```

---

**文档版本**：v1.0
**最后更新**：2025-01-18
**维护者**：Claude AI + Anthony
