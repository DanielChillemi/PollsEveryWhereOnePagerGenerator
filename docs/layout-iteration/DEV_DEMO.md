<!--
文件：docs/layout-iteration/DEV_DEMO.md
用途：Layout Iteration功能的Demo演示脚本
创建日期：2025-01-18
最后更新：2025-01-18
-->

# Layout Iteration 功能 Demo 演示脚本

## 📋 Demo信息

**时长**：5分钟
**目标观众**：项目评审、Demo Day观众
**演示设备**：MacBook（推荐使用外接显示器）
**准备时间**：10分钟

---

## 🎯 Demo目标

**核心信息**：
1. ✨ AI不仅优化内容，还能设计布局
2. 📐 Wireframe模式让用户专注于结构
3. 🤖 AI解释设计决策（建立信任）
4. 🔄 迭代式设计（human-in-the-loop）

**差异化优势**：
- 传统工具：选固定模板 → 填内容 → 导出
- 我们的工具：AI协同设计 → 迭代优化 → 个性化布局

---

## 📦 Demo前准备清单

### 1. 环境准备（提前1天）

- [ ] 后端运行正常（`http://localhost:8000`）
- [ ] 前端运行正常（`http://localhost:5173`）
- [ ] 数据库有测试数据
- [ ] OpenAI API密钥有效且有余额
- [ ] 网络连接稳定

**验证命令**：
```bash
# 后端健康检查
curl http://localhost:8000/health

# 前端访问
open http://localhost:5173
```

---

### 2. 测试账号准备

**账号**：demo@example.com
**密码**：DemoPass123

**操作**：
- [ ] 提前创建账号并登录一次
- [ ] 创建Brand Kit：
  - 名称：Demo Brand
  - 主色：#1568B8
  - 次色：#864CBD
  - 字体：Inter

---

### 3. 测试数据准备

#### 产品信息（复制到剪贴板）

```
Title: AI Task Automator

Problem:
Teams waste 40% of their time on repetitive manual tasks that could be automated. Traditional automation tools are complex to set up and require coding skills.

Solution:
Our AI learns your workflows by watching you work and automates them intelligently. No coding required - just use natural language commands.

Features:
Smart Automation Engine
Natural Language Commands
Seamless Integrations with 50+ Tools
Real-time Analytics Dashboard

Benefits:
Save 10+ hours per week on repetitive tasks
Reduce human errors by 90%
Focus on creative work that matters

Social Proof:
"This tool saved our team 40% of manual work! We can now focus on strategic initiatives instead of data entry." - Sarah Chen, Product Manager at TechCorp

CTA:
Text: Start Free Trial
URL: https://example.com/trial
```

---

### 4. 浏览器准备

- [ ] 使用Chrome或Firefox
- [ ] 清除缓存和cookies（避免缓存干扰）
- [ ] 关闭不相关的标签页
- [ ] 开启全屏模式（F11或Cmd+Shift+F）
- [ ] 字体大小：120%（便于观众看清）

**Chrome DevTools设置**（如果要展示）：
- [ ] 隐藏DevTools
- [ ] 仅在需要时打开

---

### 5. 备用方案准备

- [ ] 录制Demo视频（万一现场网络问题）
- [ ] 准备离线演示图片（PPT）
- [ ] 准备已生成的OnePager示例

---

## 🎬 Demo演示脚本（5分钟）

### 【0:00 - 0:30】开场：问题陈述

**说什么**：
> "大家好！今天展示的是我们的AI-powered one-pager创建工具。
>
> 传统的one-pager工具有个问题：你只能选择固定的模板。模板是死的，内容是活的，经常对不上。
>
> 比如，你的产品有10个feature，但模板只能放6个。或者模板是3列的，但你只有3个feature，看起来太空了。
>
> 我们的解决方案是：**让AI不仅写内容，还设计布局**。"

**操作**：
- 打开浏览器
- 显示登录页面
- （可选）展示一个传统工具的截图对比

---

### 【0:30 - 1:30】Step 1: 创建OnePager

**说什么**：
> "让我创建一个AI自动化工具的one-pager。"

**操作**：
1. 点击"Create OnePager"按钮
2. 粘贴准备好的产品信息：
   - Title
   - Problem
   - Solution
   - Features（4个）
   - Benefits（3个）
   - Social Proof
   - CTA
3. 选择Brand Kit："Demo Brand"

**说什么**（边填边说）：
> "这是基本的产品信息...问题、解决方案、功能点...
>
> 现在点击'Generate with AI'，让AI生成内容。"

**操作**：
4. 点击"✨ Generate with AI"按钮
5. **等待时说话**（填补等待时间）：
   > "在等待的时候，我想强调一点：这个系统**从不自动应用**。
   > AI只是提供建议，用户永远有最终决定权。这就是human-in-the-loop设计。"

---

### 【1:30 - 3:00】Step 2: Wireframe模式与设计控制

**说什么**：
> "好！AI生成完了。注意，我们默认进入的是**Wireframe模式**。"

**操作**：
1. 指向屏幕上的Wireframe预览

**说什么**（讲解Wireframe的价值）：
> "为什么要Wireframe？因为在早期阶段，我们不想被颜色、字体这些视觉细节分散注意力。
>
> Wireframe让你专注于**布局结构**：
> - Hero section多大？
> - Features用几列？
> - 间距是紧凑还是宽松？
>
> 看，这里显示我们有4个features，AI建议用2列。"

**操作**：
2. 指向Features section（2列布局）

**说什么**：
> "但假设我想更紧凑一点，换成3列呢？"

**操作**：
3. 打开右侧设计控制面板
4. 点击"Layout" tab
5. 将Features的columns改为 **3**
6. **指向Wireframe** → 立即更新为3列！

**说什么**（强调实时性）：
> "看！立即更新了。这就是实时预览的好处。
>
> 再调整一下间距..."

**操作**：
7. 点击"Spacing" tab
8. 将section_gap改为 **"loose"（宽松）**
9. **指向Wireframe** → section间距增大

**说什么**：
> "section之间的间距变大了，看起来更modern、更breathable。"

---

### 【3:00 - 4:00】Step 3: AI设计建议

**说什么**：
> "当然，你也可以不自己调，直接问AI的建议。"

**操作**：
1. 点击"Ask AI for Suggestion"按钮
2. 等待1-2秒
3. Toast弹出，显示AI的设计理由

**说什么**（朗读AI的理由）：
> "看这里，AI说：
>
> '基于你的4个features，我建议用2列布局，可以保持平衡和可读性。你的产品强调自动化和效率，所以我推荐使用normal spacing，搭配稍大的标题（1.2x）来强调核心价值。'
>
> 这就是**AI解释设计决策**。不是黑盒，而是告诉你**为什么**。"

**操作**：
4. 检查设计控制面板，可能已经更新参数

**说什么**：
> "我可以接受这个建议，也可以override。完全由我决定。
>
> 现在应用这些更改。"

**操作**：
5. 点击"Apply Changes"按钮
6. Toast显示"Layout Updated!"

---

### 【4:00 - 4:30】Step 4: 迭代优化（可选，时间允许的话）

**说什么**：
> "假设我觉得还是太宽松了，我可以直接告诉AI：'Make it more compact'。"

**操作**：
1. 在底部的Feedback Panel输入：
   ```
   Make it more compact
   ```
2. 点击Submit
3. 等待AI响应（1-2秒）
4. **指向Wireframe** → spacing可能变为"tight"

**说什么**：
> "看，AI理解了'compact'的意思，自动调整了间距。这就是迭代式设计。"

---

### 【4:30 - 4:50】Step 5: 切换到Preview & ASCII导出

**说什么**：
> "满意后，我可以切换到最终的设计预览。"

**操作**：
1. 点击"Design (Preview)" tab
2. 显示高保真预览

**说什么**：
> "这是最终样式。注意，刚才调整的间距、列数都反映在这里了。
>
> 我还可以导出ASCII格式，方便在Slack或邮件里分享草图。"

**操作**：
3. 切换回"Structure (Wireframe)"
4. 点击"Export ASCII"按钮
5. 文件下载
6. **（时间允许）打开.txt文件展示**：

```
═══════════════════════════════════════════════════════
              AI Task Automator
═══════════════════════════════════════════════════════

┌────────────┐  ┌────────────┐  ┌────────────┐
│ Feature 1  │  │ Feature 2  │  │ Feature 3  │
└────────────┘  └────────────┘  └────────────┘

...
```

**说什么**：
> "看，纯文本的布局草图，可以直接复制粘贴讨论。"

---

### 【4:50 - 5:00】结尾：导出PDF & 总结

**说什么**：
> "最后，导出PDF。"

**操作**：
1. 点击"Next → Export PDF"
2. 选择模板（minimalist）
3. 点击"Export PDF"
4. PDF下载
5. **（时间允许）打开PDF展示**

**说什么**（总结）：
> "总结一下，我们的系统有三个差异化优势：
>
> 1. **AI协同设计**：不仅写内容，还设计布局
> 2. **Wireframe先行**：在低成本阶段快速迭代结构
> 3. **设计决策透明**：AI告诉你为什么这样设计
>
> 传统工具是'选模板 → 填内容'，我们是'AI设计 → 用户迭代'。
>
> 谢谢大家！"

**操作**：
- 返回OnePager列表页
- 或直接结束

---

## 🎤 应对Q&A

### 预期问题1：AI会不会生成很丑的布局？

**回答**：
> "好问题！我们有两层保护：
>
> 1. **设计约束**：AI不能建议h1_scale>1.5，不能建议10列布局，所有参数都有范围限制。
> 2. **默认美观**：即使AI失败，我们会fallback到经过设计的默认值。
>
> 而且，用户永远可以手动调整或重置。"

---

### 预期问题2：这个跟Canva有什么区别？

**回答**：
> "Canva是通用设计工具，提供空白画布和模板。
>
> 我们专注于**AI驱动的one-pager生成**：
> - Canva：你自己设计
> - 我们：AI帮你设计，你优化
>
> 我们的目标用户是'不懂设计但需要快速产出专业one-pager'的人。"

---

### 预期问题3：AI的设计理由是真的分析还是编的？

**回答**：
> "AI的理由是基于：
> - 内容特征（feature数量、文字长度等）
> - 设计原则（visual hierarchy、scanability等）
> - 用户反馈（'紧凑' → tight spacing）
>
> 我们在prompt中要求AI必须**解释设计决策**，而不是随便说。
> 当然，这是AI生成的，不是hardcoded模板。"

---

### 预期问题4：支持哪些模板？

**回答**：
> "目前有4个基础模板：minimalist、bold、business、product。
>
> 但重点是，这4个模板都是**参数化的**：
> - 可以调整间距、字体大小、列数、对齐方式
> - 所以实际上能生成几十种变体
>
> 未来可以很容易扩展更多基础模板。"

---

## 🔧 故障排查

### 问题1：AI响应太慢（>5秒）

**原因**：OpenAI API高峰期
**应对**：
- 提前告知观众："OpenAI API有时会慢一点，实际使用中我们可以缓存..."
- 如果超过10秒，切换到录制好的视频

---

### 问题2：网络断开

**应对**：
- 立即切换到录制好的Demo视频
- 说："让我播放一段预先录制的完整演示..."

---

### 问题3：前端crash或white screen

**应对**：
- 快速刷新页面
- 如果仍不行，切换到备用浏览器窗口（提前打开）
- 最坏情况：展示PPT截图

---

## 📸 Demo截图清单（备用）

准备以下截图（以防万一）：

1. **Wireframe模式截图**（显示2列features）
2. **设计控制面板截图**（显示所有控件）
3. **AI设计理由Toast截图**
4. **3列Wireframe截图**（调整后）
5. **最终Preview截图**
6. **ASCII导出截图**
7. **导出的PDF截图**

保存在：`docs/layout-iteration/demo-screenshots/`

---

## 📹 录制备用视频（推荐）

### 录制清单
- [ ] 使用QuickTime或OBS录屏
- [ ] 分辨率：1920x1080
- [ ] 帧率：30fps
- [ ] 包含完整的5分钟流程
- [ ] 无背景音（现场讲解）
- [ ] 导出为MP4格式

**保存位置**：`docs/layout-iteration/demo-backup-video.mp4`

---

## ⏱️ 时间控制

### 5分钟版本（完整）
如上述脚本

### 3分钟版本（精简）
- 去掉迭代优化（Step 4）
- 去掉ASCII导出
- 只展示：创建 → Wireframe → 调整参数 → AI建议 → 导出PDF

### 7分钟版本（详细）
- 增加更多设计原则讲解
- 展示版本历史功能
- 展示回滚功能

---

## 🎯 Demo成功标准

**认为Demo成功，如果**：
- ✅ 观众理解了AI协同设计的概念
- ✅ 观众看到了Wireframe的价值
- ✅ 观众看到了实时预览的流畅性
- ✅ 观众对AI设计理由印象深刻
- ✅ 整个流程无明显卡顿或错误

---

## 📋 Demo Day前最后检查清单

**提前1小时**：
- [ ] 启动后端服务
- [ ] 启动前端服务
- [ ] 登录测试账号
- [ ] 完整走一遍流程（dry run）
- [ ] 检查网络连接
- [ ] 检查OpenAI API余额
- [ ] 准备好剪贴板数据
- [ ] 打开备用视频
- [ ] 打开备用截图文件夹
- [ ] 调整屏幕亮度和字体大小

**提前5分钟**：
- [ ] 关闭所有不相关的窗口
- [ ] 清空浏览器缓存
- [ ] 深呼吸，放松 😊

---

**祝Demo成功！🚀**

---

**文档版本**：v1.0
**最后更新**：2025-01-18
**演示者**：Anthony + Claude AI
