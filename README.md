# 🌐 김정중의 연행록 검색 웹앱

`React` 기반의 이 웹 애플리케이션은 **한국고전종합DB**의 공개 API를 활용하여 김정중의 연행록 데이터를 **키워드 기반으로 검색**하고, **문체별로 정리된 검색 결과를 확인**할 수 있는 기능을 제공합니다. 검색된 결과는 XML로 저장하거나 DCI 링크를 통해 상세 내용을 확인할 수 있습니다.

<br>

## 📸 데모 이미지

> 키워드 검색 → 문체별 결과 확인 → XML 저장 및 원문 링크 이동

![App Screenshot](https://user-images.githubusercontent.com/your-screenshot-placeholder.png)  
_※ 예시 이미지_

<br>

## 🚀 주요 기능

- ✅ 추천 키워드로 연행록 검색
- ✅ 결과 문체별 그룹화
- ✅ XML 데이터 저장 기능
- ✅ ITKC 원문 뷰어 DCI 링크 연결
- ✅ 프록시 서버를 통한 CORS 우회 처리

<br>

## ⚙️ 사용 기술

| 분야        | 사용 기술                             |
|-------------|----------------------------------------|
| 프론트엔드  | `React`, `JSX`, `CSS`                 |
| HTTP 통신   | [`Axios`](https://axios-http.com/)    |
| XML 처리    | `DOMParser`, `XMLSerializer`          |
| 프록시 API  | [`allorigins.win`](https://allorigins.win/) |

<br>

## 📦 설치 및 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/yunsoyoung2004/apiwebapp.git
cd apiwebapp

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm start

