/**
 * [*] Lazy-loaded D3 Graph Component
 * v1.0.2 Bundle Optimization: Dynamic import
 *
 * D3 라이브러리는 무거우므로 (>100KB)
 * 필요할 때만 로드합니다
 */

import React, { lazy, Suspense, ComponentType } from 'react';
import styled from '@emotion/styled';

// [+] Dynamic import: D3 라이브러리만 필요할 때 로드
const JustificationGraphD3 = lazy(() =>
  import('../design-system/components/m3/JustificationGraphD3').then(m => ({
    default: m.JustificationGraphD3
  }))
);

interface LazyD3GraphProps {
  graph: any;
  width?: number;
  height?: number;
}

// [+] Loading 상태 표시
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
  border-radius: 12px;
  color: #666;
  font-size: 14px;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.span`
  margin-left: 12px;
`;

const LoadingFallback = () => (
  <LoadingContainer>
    <Spinner />
    <LoadingText>Loading graph visualization...</LoadingText>
  </LoadingContainer>
);

/**
 * Lazy-loaded D3 Graph Wrapper
 *
 * 사용법:
 * <LazyD3Graph graph={justificationGraph} width={600} height={400} />
 *
 * Benefits:
 * - D3 라이브러리는 처음 그래프가 필요할 때만 로드
 * - 초기 번들 크기 감소 (D3 ~100KB)
 * - 그래프가 필요 없는 사용자는 D3 코드 다운로드 안 함
 */
export const LazyD3Graph: React.FC<LazyD3GraphProps> = ({
  graph,
  width,
  height
}) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JustificationGraphD3 graph={graph} width={width} height={height} />
    </Suspense>
  );
};

export default LazyD3Graph;
