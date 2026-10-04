---
name: testai
description: 智能化测试与质量保障技能，专注于自动化测试设计、测试用例生成（单元/集成/端到端/API）、边界值分析、Mock 数据构造及测试覆盖率评估。
tags: 测试, 单元测试, API测试, E2E, 测试用例生成, pytest, Jest, 质量保障
---

# 智能测试设计与质量保障 (TestAI) Skill

**核心原则：全面覆盖、边界优先、防御性校验、易维护与高可信。**

## 何时使用

- 为新功能模块或现有代码编写单元测试、集成测试或端到端（E2E）测试时
- 需要根据 PRD 或代码逻辑自动推导完整的测试用例矩阵（Test Matrix）时
- 进行接口（API）契约测试、请求参数边界测试与异常响应验证时
- 构造 Mock 数据、测试桩（Stubs）与 Fixtures 时
- 诊断测试失败原因、修复脆弱测试（Flaky Tests）或提升代码测试覆盖率时

---

## 核心测试方法论与用例设计原则

### 1. 经典黑盒用例设计方法
- **等价类划分（Equivalence Partitioning）**：有效等价类与无效等价类。
- **边界值分析（Boundary Value Analysis, BVA）**：最小值、略高于最小值、正常值、略低于最大值、最大值、越界值。
- **正交实验/判定表（Decision Tables）**：多条件组合逻辑下的排列组合覆盖。
- **错误推测法（Error Guessing）**：针对历史 Bug 常见点、空指针、并发竞争、浮点精度等进行针对性探索。

### 2. 经典测试金字塔架构
- **单元测试 (Unit Tests)**：覆盖独立函数、纯逻辑算法、工具类；运行极快、隔离外部依赖。
- **集成测试 (Integration Tests)**：覆盖组件协作、数据库交互、中间件通信。
- **端到端测试 (E2E Tests)**：覆盖用户核心真实业务路径（如 Playwright / Cypress）。

---

## 自动化测试代码规范

### Python (pytest) 示例模板

```python
import pytest
from unittest.mock import MagicMock, patch

class TestExamGeneratorService:
    """针对生成考卷服务类的测试套件"""

    @pytest.fixture
    def mock_db_session(self):
        """模拟数据库会话"""
        session = MagicMock()
        return session

    def test_generate_exam_success(self, mock_db_session):
        """正常路径：入参完整合法时成功生成试卷"""
        # Given: 准备上下文与入参
        payload = {"title": "Python 基础测试", "question_count": 5}
        
        # When: 调用被测方法
        # result = service.generate(payload, db=mock_db_session)
        
        # Then: 验证结果与断言
        # assert result.status == "SUCCESS"
        # assert len(result.questions) == 5

    @pytest.mark.parametrize("invalid_count", [0, -1, 101, None])
    def test_generate_exam_invalid_question_count(self, invalid_count, mock_db_session):
        """边界/异常路径：题目数量越界时抛出校验异常"""
        # Given / When / Then
        with pytest.raises(ValueError, match="题目数量必须在 1-100 之间"):
            # service.generate({"title": "Test", "question_count": invalid_count}, db=mock_db_session)
            pass
```

### TypeScript / JavaScript (Vitest / Jest) 示例模板

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DocumentProcessing Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should process valid document and return chunk list', async () => {
    // 1. Arrange (Given)
    const mockContent = 'Sample document content for test.';
    
    // 2. Act (When)
    // const result = await processDocument(mockContent);

    // 3. Assert (Then)
    // expect(result).toBeDefined();
    // expect(result.chunks.length).toBeGreaterThan(0);
  });

  it('should throw BadRequestException when document is empty', async () => {
    // expect(() => processDocument('')).toThrowError(/Document cannot be empty/);
  });
});
```

---

## 测试用例矩阵设计输出格式

当被要求输出测试用例计划时，采用结构化表格：

| 用例 ID | 测试模块 | 用例类型 | 前置条件 | 测试输入 / 操作步骤 | 预期输出 | 优先级 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-EXAM-001` | 考卷生成 | 正常流 (Happy Path) | 用户已登录且配额充足 | 传入标题与 10 道题目要求 | 返回 200，并生成 10 道题目 | P0 |
| `TC-EXAM-002` | 考卷生成 | 边界值 (Boundary) | 用户已登录 | 传入最小题目数 1 | 返回 200，成功生成 1 道题 | P1 |
| `TC-EXAM-003` | 考卷生成 | 边界值 (Boundary) | 用户已登录 | 传入超出上限题目数 101 | 返回 400，提示题目数超出限制 | P1 |
| `TC-EXAM-004` | 考卷生成 | 异常/安全 (Security) | 用户未登录 | 直接调用生成接口 | 返回 401 Unauthorized | P0 |
| `TC-EXAM-005` | 考卷生成 | 容错/网络 (Resilience) | 网络不稳定/AI超时 | 模拟上游 LLM 接口超时 30s | 返回 504 并在前端提示可重试 | P2 |

---

## 最佳实践准则

1. **AAA 结构**：用例内部严格遵循 **Arrange（准备）- Act（执行）- Assert（断言）** 结构。
2. **测试隔离性**：每个测试用例必须可独立运行，不依赖其他测试用例的执行顺序或全局污染状态。
3. **针对性断言**：断言必须具体（如验证具体错误码与字段），避免笼统的 `assertTrue`。
4. **Mock 合理边界**：仅 Mock 外部依赖（网络、第三方服务、文件系统），避免过度 Mock 导致被测逻辑失真。
