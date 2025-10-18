<!--
文件：docs/layout-iteration/DEV_PLAN.md
用途：Layout Iteration功能的7天完整开发计划
创建日期：2025-01-18
最后更新：2025-01-18
-->

# Layout Iteration 功能开发计划

## 📊 项目概况

**当前状态**：APP只能迭代内容（文字），无法迭代设计（布局、颜色、字体、间距）
**需求符合度**：65%
**目标符合度**：93%
**差距分析**：缺少AI驱动的布局/样式迭代能力 + 低保真Wireframe预览

**解决方案**：
1. 扩展数据模型：添加布局参数配置
2. 增强AI服务：让AI同时优化内容和设计
3. 参数化PDF模板：根据布局参数动态生成样式
4. 新增Wireframe预览：提供低保真布局可视化
5. 新增设计控制面板：让用户手动调整布局参数

---

## 🗓️ 时间规划

**总工期**：7个工作日（56小时净工作时间）
**紧急快速版**：3个工作日（24小时，功能简化版）

```
Day 0: 准备工作（4h） ✅ 完成
Day 1: 后端数据层（8h）
Day 2: 后端AI层 + 模板层（8h）
Day 3: 后端API层 + 前端基础层（8h）
Day 4: 前端UI组件层（8h）
Day 5: Wireframe预览功能（8h）
Day 6: 集成与测试（8h）
Day 7: 打磨与Demo准备（4h）
```

---

## 📋 Day 0：准备工作（4小时）✅

### 任务0.1：需求确认与设计（1.5h）
**目标**：明确技术方案和数据结构

**子任务**：
- [ ] 绘制数据模型图（LayoutParams结构）
- [ ] 定义API接口契约（输入输出格式）
- [ ] 确认AI prompt策略
- [ ] 确认向后兼容方案

**产出物**：
- 数据模型设计文档
- API接口定义文档（OpenAPI格式）

**验收标准**：
- 所有新字段定义清晰
- API输入输出格式明确
- 向后兼容策略可行

---

### 任务0.2：环境准备（1h）
**目标**：准备开发环境，确保安全

**子任务**：
- [x] 创建开发分支：`feature/layout-params-mvp`
- [x] 备份数据库到：`backup_YYYYMMDD/`
- [x] 验证前端运行正常（端口5173）
- [x] 验证后端运行正常（端口8000）
- [x] 验证OpenAI API密钥可用

**产出物**：
- Git分支创建完成
- 数据库备份文件
- 环境检查清单

**验收标准**：
- 分支从main干净拉取
- 备份文件完整可恢复
- 所有服务正常运行

---

### 任务0.3：UI/UX设计（1.5h）
**目标**：设计新UI组件和交互流程

**子任务**：
- [ ] 绘制Wireframe预览模式设计稿
- [ ] 设计设计控制面板布局（Tab结构、控件列表）
- [ ] 设计视图切换交互流程（Wireframe ↔ Preview）
- [ ] 确定ASCII导出格式样式

**产出物**：
- Wireframe设计稿（Figma或手绘）
- 设计控制面板设计稿
- 交互流程图

**验收标准**：
- 设计清晰易懂
- 交互流程合理
- 符合现有UI风格

---

## 📋 Day 1：后端数据层（8小时）

### 任务1.1：定义数据模型（2h）
**文件**：`backend/models/onepager.py`

**目标**：创建完整的布局参数数据类型

**子任务**：
- [ ] 创建ColorScheme类（颜色方案）
- [ ] 创建Typography类（排版参数：字体、大小倍数、行高）
- [ ] 创建Spacing类（间距参数：section间距、内边距倍数）
- [ ] 创建SectionLayout类（单个section布局：列数、对齐）
- [ ] 创建LayoutParams类（总配置）
- [ ] 为OnePager模型添加layout_params字段（Optional）
- [ ] 为OnePager模型添加design_rationale字段（Optional）
- [ ] 编写get_default_layout_params()辅助函数

**产出物**：
- 完整的Pydantic数据模型
- 默认值定义函数
- 数据验证规则

**验收标准**：
- 所有字段有类型注解
- 范围验证正确（如h1_scale: 0.8-1.5）
- JSON序列化/反序列化正常
- 运行 `python -m pytest tests/models/test_layout_params.py`

---

### 任务1.2：数据库迁移脚本（1.5h）
**文件**：`backend/scripts/migrate_layout_params.py`

**目标**：安全地为现有数据添加新字段

**子任务**：
- [ ] 编写迁移脚本（添加layout_params字段）
- [ ] 编写回滚脚本（删除layout_params字段）
- [ ] 添加验证步骤（检查迁移成功率）
- [ ] 编写执行文档（运行步骤、回滚步骤）

**产出物**：
- migrate_layout_params.py脚本
- 回滚功能
- 执行文档

**验收标准**：
- 能成功为所有现有OnePager添加字段
- 不破坏现有数据
- 回滚功能正常工作
- 验证步骤能检测失败

**执行命令**：
```bash
# 迁移
python backend/scripts/migrate_layout_params.py

# 验证
mongo onepager_db --eval "db.onepagers.find({layout_params: {\$exists: true}}).count()"

# 回滚
python backend/scripts/migrate_layout_params.py rollback
```

---

### 任务1.3：单元测试（1h）
**文件**：`tests/models/test_layout_params.py`

**目标**：确保数据模型正确性

**测试用例**：
- [ ] 测试默认值是否正确
- [ ] 测试超出范围的值被拒绝（如h1_scale=2.0）
- [ ] 测试无效颜色格式被拒绝（如"invalid"）
- [ ] 测试JSON序列化/反序列化
- [ ] 测试Optional字段可以为None
- [ ] 测试嵌套结构验证

**验收标准**：
- 所有测试通过
- 测试覆盖率 >90%
- 边界情况有测试

---

### 任务1.4：辅助函数与文档（1.5h）

**子任务**：
- [ ] 编写get_default_layout_params()函数
- [ ] 编写validate_layout_params()函数
- [ ] 编写merge_layout_params()函数（合并用户修改+默认值）
- [ ] 编写数据模型使用文档

**产出物**：
- 3个辅助函数
- `docs/layout-iteration/schemas/layout-params.md`文档

**验收标准**：
- 函数有完整docstring
- 文档包含示例数据
- 每个字段有清晰说明

---

## 📋 Day 2：后端AI层 + 模板层（8小时）

### 任务2.1：增强AI服务（4h）
**文件**：`backend/services/ai_service.py`

**目标**：让AI能同时优化内容和设计

**子任务**：
- [ ] 创建refine_onepager_with_design()方法
  - 接受current_content, current_layout, user_feedback, brand_kit
  - 返回{content, layout_params, design_rationale}
- [ ] 设计AI的system prompt
  - 告知AI可以调整布局
  - 提供设计原则（feature多→多列，情感化→宽松间距等）
  - 提供约束条件（h1_scale不能超过1.5等）
- [ ] 设计AI的user prompt
  - 包含当前内容和布局
  - 包含内容特征分析（feature数量、benefit数量等）
  - 包含用户反馈
- [ ] 编写响应解析逻辑
  - 解析JSON
  - 验证layout_params schema
  - 如果无效，使用默认值并记录警告
- [ ] 创建suggest_layout()方法（仅返回布局建议）

**产出物**：
- 增强后的AI服务
- 2个新方法

**验收标准**：
- AI能返回有效的layout_params
- AI能理解反馈中的设计意图（"更紧凑" → spacing: tight）
- design_rationale有实质内容（>50字）
- 测试用例通过

**测试场景**：
```python
feedback = "Make it more compact and use 2 columns for features"
result = refine_onepager_with_design(...)
assert result['layout_params']['spacing']['section_gap'] in ['tight', 'normal']
assert result['layout_params']['section_layouts']['features']['columns'] == 2
assert len(result['design_rationale']) > 50
```

---

### 任务2.2：参数化PDF模板（4h）
**文件**：`backend/templates/pdf/minimalist_v2.html`

**目标**：创建可根据layout_params动态渲染的模板

**子任务**：
- [ ] 将所有硬编码样式改为CSS变量
  - 颜色：`--color-primary`, `--color-secondary`等
  - 字体大小：`--scale-h1`, `--scale-h2`等
  - 间距：`--gap-section`, `--padding-scale`
- [ ] 使用Jinja2从layout_params注入CSS变量
- [ ] 实现动态grid布局
  - 根据section_layouts.features.columns生成列数
  - 根据alignment设置text-align
- [ ] 处理spacing逻辑
  - tight → 2rem, normal → 4rem, loose → 6rem

**产出物**：
- minimalist_v2.html模板

**验收标准**：
- 所有样式参数化
- 改变layout_params能看到PDF样式变化
- 生成的PDF仍然美观
- 用Playwright测试生成PDF成功

**测试方法**：
```python
# 测试不同参数生成不同样式
layout_params_tight = {..., 'spacing': {'section_gap': 'tight'}}
pdf1 = generate_pdf(template='minimalist_v2', layout_params=layout_params_tight)

layout_params_loose = {..., 'spacing': {'section_gap': 'loose'}}
pdf2 = generate_pdf(template='minimalist_v2', layout_params=layout_params_loose)

# PDF文件大小应该不同（因为间距不同）
assert len(pdf1) != len(pdf2)
```

---

## 📋 Day 3：后端API层 + 前端基础层（8小时）

### 任务3.1：更新API endpoints（3h）
**文件**：`backend/onepagers/routes.py`

**目标**：扩展API支持布局参数

**子任务**：
- [ ] 修改`POST /onepagers/{id}/refine` endpoint
  - 调用refine_onepager_with_design()
  - 更新content字段
  - 更新layout_params字段
  - 保存design_rationale
  - 版本历史也保存layout_params
  - 返回design_rationale给前端
- [ ] 新建`POST /onepagers/{id}/suggest-layout` endpoint
  - 调用AI获取布局建议（不实际修改数据）
  - 返回{suggested_layout_params, design_rationale}
- [ ] 修改`POST /onepagers/{id}/export-pdf` endpoint
  - 传递layout_params给模板引擎

**产出物**：
- 3个API endpoint更新

**验收标准**：
- API能正确处理layout_params
- 错误处理完善（AI失败时返回500）
- 日志记录完整
- Postman测试通过

---

### 任务3.2：前端类型定义（1h）
**文件**：`frontend/src/types/onepager.ts`

**目标**：定义TypeScript类型

**子任务**：
- [ ] 添加ColorScheme接口
- [ ] 添加Typography接口
- [ ] 添加Spacing接口
- [ ] 添加SectionLayout接口
- [ ] 添加LayoutParams接口
- [ ] 更新OnePager接口（添加layout_params和design_rationale）
- [ ] 更新OnePagerVersion接口（添加layout_params）
- [ ] 编写getDefaultLayoutParams()辅助函数

**产出物**：
- 完整的TypeScript类型定义

**验收标准**：
- TypeScript编译无错误
- 类型定义与后端schema一致
- 有JSDoc注释

---

### 任务3.3：前端API Hooks（2h）
**文件**：`frontend/src/hooks/useOnePager.ts`

**目标**：创建React Query hooks

**子任务**：
- [ ] 创建useUpdateLayout() hook
  - mutation调用PATCH /onepagers/{id}
  - 成功后invalidate缓存
- [ ] 创建useSuggestLayout() hook
  - mutation调用POST /onepagers/{id}/suggest-layout
  - 返回建议的layout_params
- [ ] 修改useRefineOnePager() hook
  - 处理返回的design_rationale
  - 更新缓存策略

**产出物**：
- 3个React Query hooks

**验收标准**：
- Hooks能正确调用API
- 缓存自动更新
- 错误处理完善
- Loading状态正确

---

### 任务3.4：集成测试（2h）
**文件**：`tests/integration/test_layout_flow.py`

**目标**：测试完整的布局迭代流程

**测试场景**：
- [ ] 创建OnePager
- [ ] 进入Refine步骤
- [ ] 调整布局参数
- [ ] 应用更改
- [ ] 请求AI建议
- [ ] 应用AI建议
- [ ] 导出PDF
- [ ] 验证PDF包含layout_params

**验收标准**：
- 测试能自动运行
- 覆盖主要流程
- 能捕获错误

---

## 📋 Day 4：前端UI组件层（8小时）

### 任务4.1：设计控制面板组件（6h）
**文件**：`frontend/src/components/onepager/DesignControlPanel.tsx`

**目标**：创建可调整布局参数的UI

**子任务**：
- [ ] 创建组件骨架（Tab结构）
- [ ] Tab 1: Spacing控件
  - section间距下拉框（tight/normal/loose）
  - padding缩放滑块（0.5-2.0）
- [ ] Tab 2: Typography控件
  - H1大小滑块（0.8-1.5）
  - H2大小滑块（0.8-1.5）
  - Body大小滑块（0.8-1.3）
  - 行高滑块（0.8-1.4）
- [ ] Tab 3: Layout控件
  - 为每个section显示列数选择器（1/2/3列）
  - 为每个section显示对齐方式选择器（left/center/right）
- [ ] "Ask AI for Suggestion"按钮
- [ ] "Apply Changes"按钮
- [ ] "Reset"按钮
- [ ] 实现本地状态管理（临时修改 vs 已保存）
- [ ] 实现实时预览（onChange通知父组件）
- [ ] 显示"有未保存更改"标记

**产出物**：
- DesignControlPanel组件
- 配套样式

**验收标准**：
- 所有控件正常工作
- 实时预览流畅
- UI美观符合Chakra UI风格
- 移动端响应式正常

---

### 任务4.2：组件测试与优化（2h）

**子任务**：
- [ ] 编写组件单元测试
- [ ] 性能优化
  - 使用React.memo避免重渲染
  - 使用useMemo缓存计算
  - 滑块onChange用debounce（300ms）

**产出物**：
- 测试文件
- 优化后的组件

**验收标准**：
- 拖动滑块不卡顿（60fps）
- 测试覆盖主要交互
- 内存使用正常

---

## 📋 Day 5：Wireframe预览功能（8小时）

### 任务5.1：Wireframe预览组件（5h）
**文件**：`frontend/src/components/onepager/WireframePreview.tsx`

**目标**：创建低保真布局预览

**子任务**：
- [ ] 创建组件骨架
- [ ] 渲染Hero section
  - 显示边框和标签
  - 用灰色方块代表headline（大小根据h1_scale）
  - 用灰色方块代表subheadline
- [ ] 渲染Features section
  - 根据section_layouts.features.columns显示grid
  - 显示feature卡片占位
- [ ] 渲染Benefits section
  - 根据section_layouts.benefits配置渲染
- [ ] 渲染CTA section
  - 显示CTA按钮占位
- [ ] 根据spacing.section_gap调整section间距
- [ ] 右上角显示布局参数信息面板
- [ ] 响应layout_params变化实时更新

**产出物**：
- WireframePreview组件

**验收标准**：
- 清晰显示布局结构
- 参数变化立即反映
- 视觉上易于理解
- 使用memo优化性能

---

### 任务5.2：ASCII生成器（3h）
**文件**：`frontend/src/utils/asciiGenerator.ts`

**目标**：将OnePager转换为ASCII艺术字符画

**子任务**：
- [ ] 实现generateASCII()函数
  - Hero section用═和空格绘制
  - Features section根据columns用Box Drawing字符
  - 根据spacing.section_gap调整空行数量
  - 文字自动换行（80字符宽度）
- [ ] 实现downloadASCII()函数
  - 导出为.txt文件

**产出物**：
- ASCII生成器工具函数

**验收标准**：
- ASCII输出格式正确
- 能反映列数变化
- 能反映间距变化
- 可下载为文本文件
- 可复制粘贴到Slack/邮件

**测试**：
```typescript
const ascii = generateASCII(onepager, layoutParams);
expect(ascii).toContain('═'); // Hero边框
expect(ascii).toContain('┌'); // Box drawing
expect(ascii.split('\n').length).toBeGreaterThan(20); // 有足够内容
```

---

## 📋 Day 6：集成与测试（8小时）

### 任务6.1：集成到RefineStep（4h）
**文件**：`frontend/src/pages/onepager/steps/RefineStep.tsx`

**目标**：将所有组件集成到Refine步骤

**子任务**：
- [ ] 添加视图模式切换（Wireframe ↔ Preview）
- [ ] 添加Tab切换组件
- [ ] 默认显示Wireframe模式
- [ ] "Export ASCII"按钮（仅Wireframe模式）
- [ ] 调整布局
  - 顶部：视图切换
  - 左侧：预览区域（2/3宽度）
  - 右侧：设计控制面板（1/3宽度）
  - 底部：反馈输入框
- [ ] 实现数据流
  - 设计控制面板变化 → 更新本地状态 → 实时更新Wireframe
  - 点击Apply → 调用API → 更新服务器数据
- [ ] 显示AI的design_rationale（紫色框）

**产出物**：
- 更新后的RefineStep页面

**验收标准**：
- 所有组件正确集成
- 视图切换流畅
- 数据流正确
- 无控制台错误

---

### 任务6.2：E2E测试（3h）
**文件**：`tests/e2e/test_layout_iteration.py`

**目标**：用Playwright测试完整流程

**测试步骤**：
1. [ ] 创建OnePager（填写表单）
2. [ ] AI生成内容
3. [ ] 进入Refine步骤
4. [ ] 验证默认是Wireframe模式
5. [ ] 调整布局参数（改列数、间距）
6. [ ] 验证Wireframe实时更新
7. [ ] 请求AI建议
8. [ ] 验证toast显示设计理由
9. [ ] 应用更改
10. [ ] 切换到Preview模式
11. [ ] 导出ASCII文件
12. [ ] 验证ASCII内容正确
13. [ ] 导出PDF
14. [ ] 验证PDF文件生成

**验收标准**：
- 所有步骤通过
- 能捕获截图
- 测试稳定（不会随机失败）

---

### 任务6.3：Bug修复（1h）

**子任务**：
- [ ] 运行所有测试
- [ ] 记录失败的测试
- [ ] 修复发现的bug
- [ ] 重新测试

---

## 📋 Day 7：打磨与Demo准备（4小时）

### 任务7.1：UI打磨（2h）

**子任务**：
- [ ] 添加过渡动画（视图切换时淡入淡出）
- [ ] 添加loading skeleton（加载时显示占位符）
- [ ] 改进toast样式（AI建议的toast更显眼）
- [ ] 添加帮助提示（控件旁边的小问号图标）
- [ ] 响应式优化（确保移动端正常）
- [ ] 清理控制台warning

**验收标准**：
- 视觉效果专业
- 交互流畅
- 无明显UI bug

---

### 任务7.2：Demo准备（1.5h）

**子任务**：
- [ ] 编写5分钟Demo演示脚本
- [ ] 准备测试数据（示例产品信息）
- [ ] 录制Demo视频（备用）
- [ ] 准备Demo环境（独立测试账号）

**产出物**：
- Demo脚本文档（docs/layout-iteration/DEV_DEMO.md）
- 测试数据文件
- Demo视频（可选）

---

### 任务7.3：文档完善（30min）

**子任务**：
- [ ] 更新README.md
- [ ] 完善API文档
- [ ] 完善开发者文档

---

## ✅ 最终交付清单

### 后端
- [ ] 5个新数据模型类（LayoutParams及子类）
- [ ] 数据库迁移脚本
- [ ] AI服务增强（2个新方法）
- [ ] 1个参数化PDF模板
- [ ] 3个API endpoint更新
- [ ] 10+个单元测试

### 前端
- [ ] 5个TypeScript接口
- [ ] 3个React Query hooks
- [ ] WireframePreview组件
- [ ] DesignControlPanel组件
- [ ] ASCII生成器工具
- [ ] RefineStep页面集成
- [ ] 1个E2E测试

### 文档
- [ ] 数据模型文档
- [ ] API文档
- [ ] 使用指南
- [ ] 开发指南
- [ ] Demo脚本

### Demo
- [ ] 测试环境就绪
- [ ] Demo数据准备
- [ ] Demo脚本演练

---

## 🎯 成功标准

### 技术指标
- 所有测试通过率 >95%
- API响应时间 <2秒（p95）
- Wireframe预览实时更新无卡顿
- PDF生成时间 <5秒

### 功能指标
- AI能返回有效的布局建议（100%成功率）
- 布局参数变化能在PDF中体现
- Wireframe模式能清晰展示布局结构
- ASCII导出格式正确

### 业务指标
- 需求符合度达到93%（从65%提升）
- Demo完整演示 <6分钟
- 功能差异化明显（AI设计协作）

---

## ⚠️ 风险管理

| 风险 | 概率 | 影响 | 应对策略 | 备用方案 |
|------|------|------|---------|---------|
| AI返回无效JSON | 中 | 高 | Schema验证 + fallback | 使用默认值 |
| PDF生成太慢 | 低 | 中 | 优化模板大小 | 增加timeout |
| 实时预览卡顿 | 中 | 中 | Debounce + memo | 移除实时预览 |
| 迁移失败 | 低 | 高 | 完整备份 + 回滚脚本 | 手动修复数据 |
| Demo时网络问题 | 低 | 中 | 本地mock | 播放录制视频 |
| 时间不够 | 中 | 中 | 优先核心功能 | 砍掉ASCII导出 |

---

## 🚀 3天快速版（如果时间紧迫）

**只做Day 1-3的核心功能**：
- Day 1: 数据模型 + 迁移
- Day 2: AI服务 + 参数化模板
- Day 3: 简单设计控制面板（3个滑块）

**不做**：
- Wireframe预览
- ASCII导出
- 完整的设计控制面板

**符合度**：约85%（可接受）

---

## 📞 联系与协作

**每天工作流程**：
1. 读取DEV_PLAN.md了解任务
2. 检查DEV_PROGRESS.md了解进度
3. 更新TodoWrite标记完成情况
4. 每天结束更新DEV_PROGRESS.md

**遇到问题时**：
1. 记录在DEV_PROGRESS.md的"问题"部分
2. 评估影响和解决方案
3. 必要时调整计划

---

**计划版本**：v1.0
**最后更新**：2025-01-18
