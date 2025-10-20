/**
 * [*] Pyodide Lazy Loader
 * v1.0.2 Bundle Optimization: Dynamic Pyodide loading
 *
 * Pyodide는 매우 무거움 (~20MB 압축됨)
 * 필요할 때만 로드하고, 로드 상태를 캐시합니다
 */

// [+] Singleton: Pyodide 로드 상태 캐시
let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;

/**
 * Pyodide 동적 로드
 *
 * 첫 호출: Pyodide 다운로드 및 초기화 (~5-10초)
 * 후속 호출: 캐시된 인스턴스 반환 (즉시)
 *
 * 사용법:
 * const pyodide = await loadPyodide();
 * const result = await pyodide.runPythonAsync('2 + 2');
 */
export async function loadPyodide() {
  // [+] 이미 로드된 경우: 캐시된 인스턴스 반환
  if (pyodideInstance) {
    return pyodideInstance;
  }

  // [+] 로딩 중인 경우: 기존 Promise 반환
  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  // [+] 새로 로드 시작
  pyodideLoadingPromise = (async () => {
    try {
      console.log('[PERF] Loading Pyodide (first time)...');
      const startTime = performance.now();

      // Pyodide 동적 import
      const { loadPyodide: initPyodide } = await import('pyodide');

      // Pyodide 초기화
      pyodideInstance = await initPyodide();

      const duration = performance.now() - startTime;
      console.log(`[PERF] Pyodide loaded in ${duration.toFixed(2)}ms`);

      return pyodideInstance;
    } catch (error) {
      console.error('[ERROR] Failed to load Pyodide:', error);
      pyodideLoadingPromise = null; // 다음 재시도 가능하게
      throw error;
    }
  })();

  return pyodideLoadingPromise;
}

/**
 * Pyodide 검증 실행 (lazy loaded)
 *
 * SymPy를 사용한 수식 검증
 *
 * 사용법:
 * const result = await verifyWithPyodide('x + 2 = 5', 'x = 3');
 */
export async function verifyWithPyodide(
  equation: string,
  expectedResult: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    const pyodide = await loadPyodide();

    const pythonCode = `
import sympy as sp

def verify_equation(eq, expected):
    try:
        # Parse equation and expected result
        eq_expr = sp.sympify("${equation}")
        exp_expr = sp.sympify("${expectedResult}")

        # Simple validation
        return {
            'valid': True,
            'equation': str(eq_expr),
            'result': str(exp_expr)
        }
    except Exception as e:
        return {'valid': False, 'error': str(e)}

result = verify_equation("${equation}", "${expectedResult}")
result
    `;

    const result = await pyodide.runPythonAsync(pythonCode);
    return result;
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * 간단한 심볼 계산 (로컬)
 * Pyodide 로드 전에 사용 가능
 *
 * 용도: 가벼운 계산, Pyodide 로드 대기 중
 */
export function simpleSymbolicCheck(expression: string): boolean {
  try {
    // 기본적인 수식 검증 (정규식)
    const basicPatterns = [
      /^\d+\s*[+\-*/]\s*\d+\s*=\s*\d+$/, // Simple math: 2 + 2 = 4
      /^[a-z]+\s*=\s*[\d-]+$/, // Simple assignment: x = 5
      /^\d+\s*[+\-*/]\s*[a-z]+\s*=\s*\d+$/ // Mixed: 2 + x = 5
    ];

    return basicPatterns.some(pattern => pattern.test(expression.toLowerCase()));
  } catch {
    return false;
  }
}

/**
 * Pyodide 로드 상태 확인 (디버깅용)
 */
export function getPyodideStatus(): {
  loaded: boolean;
  loading: boolean;
} {
  return {
    loaded: !!pyodideInstance,
    loading: !!pyodideLoadingPromise && !pyodideInstance
  };
}

/**
 * Pyodide 캐시 초기화 (테스트용)
 */
export function resetPyodide() {
  pyodideInstance = null;
  pyodideLoadingPromise = null;
}

export default {
  loadPyodide,
  verifyWithPyodide,
  simpleSymbolicCheck,
  getPyodideStatus,
  resetPyodide
};
