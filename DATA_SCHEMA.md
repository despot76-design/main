# 노트픽 데이터 스키마 초안

## 원칙
- 비교 UI는 최소 8대 동시 비교를 기본으로 설계한다.
- 쿠팡에서 공통적으로 잘 노출되는 필드와 외부 보강이 필요한 필드를 분리한다.
- 가격 데이터는 매일 누적 저장하고, WOW/일반가/쿠폰가/카드가를 가능한 한 분리한다.
- CPU/GPU 성능점수와 최신성은 쿠팡 상품명만 믿지 않고 별도 기준 DB로 매칭한다.

## A. 쿠팡에서 우선 직접 수집할 필드
- coupang_product_id
- coupang_item_id
- vendor_item_id
- brand
- product_title_raw
- model_name
- product_year
- cpu_marketing_name
- gpu_marketing_name
- ram_capacity
- storage_capacity
- os
- display_size (노출 시)
- panel_type (노출 시)
- resolution_grade (노출 시)
- normal_price
- wow_price
- coupon_price
- card_price (노출 시)
- discount_label
- rocket_delivery
- seller
- rating
- review_count
- stock_status
- collected_at

## B. 제조사/벤치마크 DB로 보강할 필드
- cpu_exact_model
- cpu_family
- cpu_generation
- cpu_release_date
- cpu_latestness
- cpu_single_score
- cpu_multi_score
- npu_tops
- igpu_exact_model
- igpu_score
- dgpu_exact_model
- dgpu_score
- ram_type
- ram_expandable
- max_ram
- ssd_interface
- ssd_slots
- display_resolution_exact
- display_brightness_nits
- refresh_rate
- color_gamut
- battery_wh
- weight_kg
- thickness_mm
- usb_c_count
- thunderbolt_or_usb4
- hdmi_version
- wifi_version
- pd_charging

## C. 우리 사이트가 계산할 필드
- price_7d_avg
- price_30d_avg
- price_30d_low
- price_90d_low
- discount_vs_30d_avg
- price_percentile_same_class
- performance_score
- portability_score
- display_score
- cpu_latestness_score
- value_score
- verdict
- recommended_use_cases
- warning_flags

## 비교표 설계
비교 항목은 실제 수집률을 확인한 뒤 확정한다. 화면에는 최대 8대가 기본 선택 가능하며, PC에서는 가로 스크롤 방식으로 표시한다. 첫 열(비교 항목)과 첫 행(제품명)은 고정한다.

## 데이터 품질 규칙
1. 같은 모델명의 RAM/SSD/OS 옵션은 서로 다른 SKU로 저장하되 기본 모델 ID로 묶는다.
2. 'Core i7', 'Ryzen 7'처럼 세부 모델이 없는 경우 CPU 성능점수를 임의 추정하지 않는다.
3. 쿠팡 표시 연도(예: 2026 노트북)와 CPU 실제 출시연도는 별도 필드로 저장한다.
4. WOW 가격은 일반 가격과 절대 합치지 않는다.
5. 쿠폰/카드 할인은 적용 조건과 유효 시각을 저장한다.
6. 수집 실패 시 전일 값을 오늘 값처럼 덮어쓰지 않는다.
