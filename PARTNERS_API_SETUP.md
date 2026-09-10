# 쿠팡 파트너스 API 연동 메모

## 결론
노트픽의 상품 후보/현재가/이미지/파트너스 링크 수집은 HTML 크롤링보다 쿠팡 파트너스 상품 API를 1순위로 사용한다.

판매자용 Coupang Open API는 WING 판매자가 자신의 상품/주문/프로모션을 관리하기 위한 API이므로 전체 쿠팡 노트북 비교의 주 데이터원으로 적합하지 않다.

쿠팡 파트너스 가이드에는 웹/앱 개발자를 위한 파트너스 API와 상품 API가 별도로 있으며 쿠팡 상품 정보를 사이트/앱에 적용할 수 있다고 안내한다.

## 필요한 환경변수
- COUPANG_ACCESS_KEY
- COUPANG_SECRET_KEY
- COUPANG_PARTNERS_SEARCH_PATH (선택, 쿠팡 문서에서 엔드포인트가 변경될 경우 대응)

Secret Key는 GitHub 코드에 직접 넣지 않는다. Vercel 또는 GitHub Actions Secret에만 저장한다.

## 1차 수집 데이터
파트너스 상품 검색 API에서 실제 응답으로 제공되는 필드만 저장한다.
- product_id
- product_name
- current_price
- image_url
- affiliate_url
- is_rocket
- is_free_shipping (응답에 있을 경우)
- collected_at
- raw response

## 2차 정제
상품명으로 진짜 노트북인지 판별한 뒤 액세서리/필름/충전기/거치대 등을 제외한다.

## 3차 사양 보강
파트너스 상품 API만으로 CPU/RAM/SSD/디스플레이 전체 상세정보가 확보되지 않을 수 있으므로 모델번호 식별 후 제조사 사양 DB 및 CPU/GPU benchmark DB를 별도 연결한다.

## 운영 원칙
1. 상품 후보 수집과 상세 사양 수집을 분리한다.
2. API가 주지 않은 값은 추정값을 사실처럼 저장하지 않는다.
3. 상품 ID와 실제 노트북 모델 ID를 분리한다.
4. 매일 05:00 KST에 전체 가성비 재계산을 수행한다.
5. 가격은 향후 API 호출 정책 범위에서 더 자주 갱신할 수 있도록 별도 작업으로 분리한다.
6. 비교 UI는 8대 동시 비교를 기본 요구사항으로 유지한다.
