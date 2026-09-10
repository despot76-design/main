# 쿠팡 노트북 샘플 데이터 점검

점검일: 2026-09-10

## 목적
쿠팡 노트북 상품 페이지/검색 노출에서 어떤 항목이 반복적으로 확보되는지 확인하고, 향후 8대 이상 비교표의 기본 항목과 보강 데이터 소스를 결정한다.

## 확인한 주요 브랜드
- 삼성전자
- LG전자
- Lenovo
- ASUS
- HP

## 현재까지 확인된 데이터 가용성

### A. 쿠팡에서 비교적 안정적으로 확보 가능
- 상품명
- 브랜드
- 판매가
- 할인 전 기준가가 노출되는 경우
- WOW 회원가 / WOW 쿠폰가가 노출되는 경우
- 일반판매가 / 일반할인가가 노출되는 경우
- RAM 용량
- SSD 용량
- 운영체제
- 쿠팡 상품번호
- 제품 모델번호 또는 Manufacturer Part Number가 노출되는 경우
- 리뷰 수

### B. 상품별 편차가 있으나 자주 확보 가능
- CPU 브랜드
- CPU 계열(Core Ultra 5/7, Ryzen 5/7, Ryzen AI 등)
- 정확한 CPU 모델 번호
- 화면 크기
- 해상도
- 패널 종류
- 노트북 출시년월
- 무게
- 저장장치 인터페이스
- GPU/그래픽카드 정보

### C. 쿠팡만으로는 안정적 비교가 어려워 외부 보강이 필요
- CPU 정확한 출시일과 세대 계보
- CPU 싱글/멀티 벤치마크
- iGPU/dGPU 상대 성능
- NPU 성능
- 배터리 용량 및 실사용 시간
- 디스플레이 밝기
- 색재현율
- 포트 전체 구성
- RAM 업그레이드 가능 여부
- SSD 슬롯/업그레이드 가능 여부
- USB-C PD 충전 여부
- Thunderbolt/USB4 세부 규격

## 중요한 발견
1. 상품 제목의 `2026`, `2025` 등은 노트북 판매 모델 연식일 수 있으며 CPU 출시연도와 동일하다고 보면 안 된다.
2. `Core i7`, `Core Ultra 7`, `Ryzen 7` 같은 등급명만으로 성능을 판단하면 오류가 크다. 정확한 CPU 모델 번호를 별도 확보해야 한다.
3. WOW 할인은 하나의 형태가 아니다. `와우할인가`, `와우쿠폰할인가`, `카드 즉시할인 와우 전용`, `와우 가입 쿠폰할인가` 등 여러 형태가 확인된다.
4. 동일 제품군이라도 판매자/옵션에 따라 가격과 OS, RAM, SSD 구성이 달라질 수 있으므로 상품 단위와 실제 구성 SKU 단위를 분리해야 한다.
5. 쿠팡 페이지에서 패널·무게·해상도 등이 모두 노출되는 상품도 있지만, 상품에 따라 CPU/SSD 정도만 노출되어 비교표를 쿠팡 단독 데이터로 완성하기 어렵다.

## 제안 데이터 구조

### 1. commerce_snapshot
매일/수시로 변하는 값
- coupang_product_id
- item_id / vendor_item_id
- seller
- captured_at
- list_price
- normal_price
- wow_price
- coupon_price
- card_price
- shipping_type
- availability
- review_count

### 2. laptop_variant
비교의 기준이 되는 실제 구성
- brand
- family
- model_number
- cpu_exact
- gpu_exact
- ram_gb
- storage_gb
- os
- display_size

### 3. verified_specs
제조사/공식 문서로 보강
- panel
- resolution
- brightness
- refresh_rate
- color_gamut
- weight
- battery_wh
- ports
- wifi
- ram_upgrade
- storage_upgrade

### 4. performance_db
- cpu_single_score
- cpu_multi_score
- cpu_generation
- cpu_release_date
- gpu_score
- npu_score
- source
- updated_at

## 비교표 정책 초안

지금 비교 항목을 고정하지 않는다. 실제 대량 수집 후 각 필드의 `수집 성공률`을 계산해서 다음과 같이 분류한다.

- 90% 이상: 기본 비교표 후보
- 60~89%: 상세 비교표 후보 또는 외부 보강
- 30~59%: 제조사 데이터 보강 후 사용
- 30% 미만: 기본 비교표에서 제외, 전문가 보기에서만 검토

## 다음 단계
1. 실제 쿠팡 노트북 목록을 더 넓게 수집
2. 동일 모델 중복/옵션 상품 정규화
3. 필드별 수집 성공률 계산
4. CPU 정확 모델 미확인 상품 비율 계산
5. 제조사 보강 우선순위 결정
6. 8개 기본 비교 화면에 실제 데이터 연결
