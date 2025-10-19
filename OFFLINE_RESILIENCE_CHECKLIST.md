# ProofCore v1.0.0 - 인터넷 단절 대비 체크리스트

**목표**: 인터넷이 끊겨도 35시간 작업의 진행상황을 온전히 복구할 수 있도록 준비

---

## Phase 0: 사전 준비 (지금 당장)

### 📁 로컬 파일 백업

```bash
# 1. ProofCore 3.8 엔진 파일 오프라인 복사
mkdir -p D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup\engine-3.8
cp "D:\Sanctum\Proofbench\Proofbench 3.8 project"/*.ts \
   D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup\engine-3.8/

# 2. 핵심 문서 로컬 저장
cp D:\Sanctum\Proofbench\*.txt \
   D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup/

cp D:\Sanctum\Proofbench\*.md \
   D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup/

# 3. 체크: 파일 확인
ls -la D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup/
```

**체크리스트**:
- [ ] engine-3.8/*.ts (5개 파일)
- [ ] plan.txt, plab2.txt, plan3.txt
- [ ] PHASE_4_5_INTEGRATION_DESIGN.md
- [ ] EXECUTION_PRIORITY_MATRIX.md

---

### 🔧 로컬 개발 환경 준비

```bash
# 1. npm 패키지 캐시 확보
cd D:\Sanctum\Proofbench\Proofcore\ AI-benchmark
npm ci  # package-lock.json 기반 설치

# 2. Git 준비
git init  # 이미 되어있으면 SKIP
git add -A
git commit -m "Initial commit before offline work"

# 3. 상태 확인
npm run test  # 오프라인에서 실행 가능한 테스트?
git status    # clean 상태 확인
```

**체크리스트**:
- [ ] npm ci 성공
- [ ] git status clean
- [ ] npm test 1회 성공

---

### 📋 진행상황 추적 문서 생성

```bash
# 1. 진행상황 파일 생성
cat > D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\WORK_IN_PROGRESS.md << 'EOF'
# ProofCore v1.0.0 - 진행 중

## 현재 상태 (업데이트: [DATE])

### Day 1 상태
- [ ] Task 1-1: 브랜딩 통일
- [ ] Task 1-2: 오프라인 CI
- [ ] Task 1-3: README

### 마지막 커밋
커밋 해시: [자동 기입]
메시지: [자동 기입]

### 주의사항
- 인터넷 단절 예상 시간: [기입]
- 우선순위: Task 1-1 → 1-2 → 1-3

## 인터넷 복구 체크리스트
- [ ] git status 확인
- [ ] 변경사항 있는지 확인
- [ ] 새 파일들 add 여부 확인
- [ ] git push (origin/main)
EOF

git add WORK_IN_PROGRESS.md
git commit -m "docs: add work progress tracking"
```

**체크리스트**:
- [ ] WORK_IN_PROGRESS.md 생성
- [ ] git 커밋 완료

---

## Phase 1: 오프라인 작업 중 진행상황 기록

### 📝 각 Task 완료 후 즉시

```bash
# 1. 작업 완료 시 상태 파일 업데이트
# (오프라인 텍스트 편집기로 수동 수정)
D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\WORK_IN_PROGRESS.md
→ 해당 Task 체크박스 [x] 표시

# 2. Git 커밋 (오프라인에서도 가능)
git add -A
git commit -m "Task 1-1: 브랜딩 통일 완료"

# 3. 매 Task마다 로컬 백업
# 예: Task 1-1 완료 후
mkdir -p D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup\day1
cp -r . D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup\day1/$(date +%H%M%S)
```

**이점**:
- ✅ 로컬 Git 히스토리 자동 생성
- ✅ 인터넷 복구 시 모든 커밋 온전히 유지
- ✅ 어느 지점에서 단절되었는지 명확

---

## Phase 2: 인터넷 단절 시 대응

### 🚨 인터넷 끊김 감지

```bash
# 1. 즉시 확인
ping google.com 2>/dev/null || echo "OFFLINE"

# 2. 오프라인 모드 진입
echo "OFFLINE MODE ACTIVATED" >> D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\OFFLINE_LOG.txt
date >> D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\OFFLINE_LOG.txt
git log --oneline -n 5 >> D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\OFFLINE_LOG.txt

# 3. 마지막 상태 저장
git status > D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\last_git_status.txt
```

**체크리스트**:
- [ ] OFFLINE_LOG.txt 생성
- [ ] last_git_status.txt 저장
- [ ] 심호흡하고 계속 작업

---

### ✅ 오프라인에서 계속 진행 가능한 작업

```bash
# TIER 1 작업들 (모두 오프라인 가능)
Task 1-1: 브랜딩 통일
  → sed 명령어로 텍스트 치환 (인터넷 불필요)
  → 로컬 파일만 수정

Task 1-2: 오프라인 CI 게이트
  → YAML/TypeScript 파일 생성 (텍스트 편집)
  → 새로운 파일 추가만 하면 됨

Task 1-3: README 재작성
  → 마크다운 편집 (인터넷 불필요)

Task 2-1/2-2/2-3: 벤치마크 시스템
  → Python/JavaScript 파일 작성
  → 로컬에서 실행 가능

Task 3-1/3-2/3-3: 엔진 통합 & 테스트
  → 로컬 파일 복사 + 테스트 실행
  → npm test (캐시됨)

Task 3-4: 배포 준비
  → Git 작업만 (로컬)
  → RELEASE_NOTES 작성
```

**결론**: **Task 1-1 ~ 3-4는 모두 인터넷 없이 완료 가능**

---

### ❌ 오프라인에서 불가능한 작업

```bash
# Task 4-1: Show HN 제출
  → 웹사이트 접속 필요
  → 인터넷 복구 후

# Task 4-2: Twitter 공유
  → 네트워크 필수
  → 인터넷 복구 후

# git push / npm publish
  → 원격 저장소 연결 필요
  → 인터넷 복구 후

# 해결책: 이 작업들만 나중으로 미루기
```

---

## Phase 3: 인터넷 복구 시 동기화

### 🔌 인터넷 복구 감지

```bash
# 1. 연결 확인
ping google.com && echo "ONLINE" || echo "OFFLINE"

# 2. 복구 로그 기록
echo "INTERNET RESTORED" >> D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\OFFLINE_LOG.txt
date >> D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\OFFLINE_LOG.txt
```

---

### 🔄 Git 동기화

```bash
# 1. 상태 확인
git status

# 2. 변경사항 확인
git log --oneline -n 10

# 3. 리모트 설정 (이미 되어있을 것)
git remote -v

# 4. 모든 변경사항 push
git add -A
git commit -m "Offline work completed - ready to push"
git push origin main

# 5. v1.0.0 태그 push
git push --tags
```

**체크리스트**:
- [ ] git status clean
- [ ] 모든 커밋 로컬에 있음
- [ ] git push 성공
- [ ] --tags push 성공

---

### 📦 npm/Docker 배포

```bash
# 1. npm publish (인터넷 복구 후)
npm publish --access public

# 2. Docker build & push
docker build -t proofcore:1.0.0 .
docker tag proofcore:1.0.0 ghcr.io/flamehaven/proofcore:1.0.0
docker push ghcr.io/flamehaven/proofcore:1.0.0

# 3. GitHub Release 생성
gh release create v1.0.0 -F RELEASE_NOTES_v1.0.0.md
```

---

## 📊 오프라인 시간대 최적화

### 예상 시나리오

```
인터넷 단절: 작업 중간 (예: Task 1-2 진행 중)

| 시간 | 작업 | 상태 |
|------|------|------|
| 08:00 | Task 1-1 완료 | ✅ 온라인 |
| 10:00 | Task 1-2 진행 중 → 인터넷 끊김 | 🔌 오프라인 시작 |
| 10:05 | Task 1-2 계속 진행 | ✅ 가능 (텍스트 파일) |
| 11:30 | Task 1-3 진행 | ✅ 가능 (마크다운) |
| 14:00 | Task 2-1/2-2/2-3 진행 | ✅ 가능 (파이썬) |
| 18:00 | Task 3-1/3-2 진행 | ✅ 가능 (npm 캐시) |
| 20:00 | Task 3-3/3-4 진행 | ✅ 가능 (git 로컬) |
| 22:00 | 인터넷 복구 | 🔌 온라인 복구 |
| 22:30 | git push + npm publish | ✅ 마무리

결과: 12시간 오프라인 작업 → 0 손실
```

---

## 🛡️ 최악의 시나리오 대응

### 시나리오 1: 인터넷 단절 → 작업 계속 → 컴퓨터 재부팅

```bash
# 재부팅 후에도 복구 가능한 이유:
# 1. Git 로컬 저장소 (.git/ 폴더)
# 2. 오프라인 백업 폴더 (offline-backup/)
# 3. 모든 파일 로컬 저장

# 복구 절차:
git log  # 모든 커밋 온전함
git status  # modified 파일 확인
git diff > recovery.patch  # 변경사항 저장
```

---

### 시나리오 2: 인터넷 단절 중 Git 오류 발생

```bash
# 해결책: 로컬 백업에서 복구
cp -r D:\Sanctum\Proofbench\Proofcore\ AI-benchmark\offline-backup\day1\* \
    D:\Sanctum\Proofbench\Proofcore\ AI-benchmark/

# 또는 마지막 좋은 상태로 돌아가기
git reflog  # 모든 로컬 히스토리 확인
git reset --hard <commit-hash>  # 복구
```

---

### 시나리오 3: 인터넷 복구 후 push 실패

```bash
# 1. 상태 확인
git status
git log origin/main..HEAD  # 로컬 전용 커밋 확인

# 2. 강제 동기화 (주의!)
git pull origin main --rebase
git push origin main -f  # 최후의 수단

# 3. 또는 새 브랜치로 제출
git checkout -b feature/offline-work-complete
git push -u origin feature/offline-work-complete
```

---

## ✨ 요약: 인터넷 단절 대비 전략

### 오프라인 안전 보장

| 작업 | 오프라인 | 온라인 필요 시점 |
|------|----------|-----------------|
| Task 1-1~3-4 | ✅ 완전 가능 | 없음 |
| Task 4-1/4-2 | ❌ 불가 | 인터넷 복구 후 |
| git push | ⏸ 미루기 | 인터넷 복구 후 |
| npm publish | ⏸ 미루기 | 인터넷 복구 후 |

### 복구 보장

```
원격 저장소에 push할 때까지:
  → 모든 작업 로컬 Git에 보관
  → 오프라인 백업 폴더에 보관
  → 인터넷 단절 = 진행상황 손실 ZERO
```

### 인터넷 복구 절차

```bash
# 30초 안에 완료
git add -A
git commit -m "Complete offline work - $(date)"
git push
echo "✅ 완료!"
```

---

## 📋 최종 체크리스트

### 지금 당장 (사전 준비)

- [ ] offline-backup 디렉토리 생성
- [ ] 엔진 파일 복사 완료
- [ ] npm ci 실행
- [ ] git commit 완료
- [ ] OFFLINE_LOG.txt 파일 생성

### 작업 시작 전

- [ ] WORK_IN_PROGRESS.md 준비
- [ ] Task별 진행상황 추적 준비
- [ ] 오프라인에서 Task 1-1 시작 가능 확인

### 인터넷 단절 시

- [ ] OFFLINE_LOG.txt에 기록
- [ ] Task 1-1~3-4 계속 진행
- [ ] 각 Task마다 git commit
- [ ] Task 4-1/4-2는 보류

### 인터넷 복구 시

- [ ] OFFLINE_LOG.txt 종료 기록
- [ ] git push 실행
- [ ] Task 4-1/4-2 완료
- [ ] npm publish (필요시)

---

**준비 완료. 인터넷이 끊겨도 안전하게 작업 가능합니다.** ✅

