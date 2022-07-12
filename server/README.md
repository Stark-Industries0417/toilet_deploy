<h1 align="center">Welcome to Which Toilet-Server 👋</h1>

> Which Toilet Back-End Server Project

<p>
  <img width="280" alt="image" src="https://user-images.githubusercontent.com/59994664/178424049-e0d5ddba-2627-48ed-8de6-c27409321c69.png">
  <img width="280" alt="image" src="https://user-images.githubusercontent.com/59994664/178424141-6ec74369-fea5-4baf-b07f-eb438bf68ab4.png">
  <img width="280" alt="image" src="https://user-images.githubusercontent.com/59994664/178424652-24013779-14bd-467b-8d3c-c7fcb7225642.png">
</p>

## API Docs

### ✨ [Which Toilet Server Swagger](http://3.35.184.107:5000/api-docs)

## 기술스택

<p>
  <img src="https://img.shields.io/badge/-NestJS-red"/>&nbsp
  <img src="https://img.shields.io/badge/-AWS%20S3-orange"/>&nbsp
  <img src="https://img.shields.io/badge/-MySQL-yellow"/>&nbsp
  <img src="https://img.shields.io/badge/-Docker-blue"/>&nbsp
  <img src="https://img.shields.io/badge/-Jenkins-success"/>&nbsp
  <img src="https://img.shields.io/badge/-Swagger-black"/>&nbsp
  <img src="https://img.shields.io/badge/-JWT-yellowgreen"/>&nbsp
  <img src="https://img.shields.io/badge/-TypeORM-violet"/>&nbsp
  <img src="https://img.shields.io/badge/-typescript-lightgrey"/>
</p>

## 시스템 구성도

![image](https://user-images.githubusercontent.com/59994664/178422769-1a626563-680f-4487-8751-36f7544c12f2.png)

## ERD

<img width="783" alt="image" src="https://user-images.githubusercontent.com/59994664/177917910-5f7ab093-24ad-4d69-8071-8ae2e1061619.png">

## 개발일지

- Http Exception filter 설정(22/05/17) - `commit` : [2a3e66a](https://github.com/Stark-Industries0417/toilet_deploy/commit/2a3e66ad86a5648cfff88d23de12f15cbc535843)
- 회원 가입 API 완성 (22/05/21) - `commit` : [9211946](https://github.com/Stark-Industries0417/toilet_deploy/commit/921194696ab60b70192341bca3015353a7e9e7eb), [d432952](https://github.com/Stark-Industries0417/toilet_deploy/commit/d432952cfb0df45eb7e4bd1be57b147523bc5f0e), [dfa99e4](https://github.com/Stark-Industries0417/toilet_deploy/commit/dfa99e4662836e4ca6e8d8b31ef49cd079033516)
- 로그인, JWT 토큰 발급 API 완성 (22/05/28) - `commit` : [cc2784e](https://github.com/Stark-Industries0417/toilet_deploy/commit/cc2784ecb088bf1754da34289d171d4b9714b169), [d8c22b4](https://github.com/Stark-Industries0417/toilet_deploy/commit/d8c22b440d7aa57de45499147a0f0109d63ac6ef)
- 로그인한 사용자 정보 API 완성(22/05/31) - `commit` : [83f6aea](https://github.com/Stark-Industries0417/toilet_deploy/commit/83f6aea85022fb8ca0746fa524bbf70607003941), [e79c9fa](https://github.com/Stark-Industries0417/toilet_deploy/commit/e79c9fa03281031e31bf73c080f4d2f8e6a30dd6)
- 이미지 aws S3 업로드 SDK(22/05/31) - `commit` : [aws-sdk](https://github.com/Stark-Industries0417/toilet_deploy/blob/main/server/src/aws.service.ts)
- 토큰으로 사용자 정보 반환 API 완성(22/05/31) - `commit` : [7bd4b82](https://github.com/Stark-Industries0417/toilet_deploy/commit/7bd4b820c5f4ce2e77d1f670bf601eed7d8196c7)
- 사용자 비밀번호 재설정 메일 전송 서비스 API 완성(22/06/01) - `commit` : [21def35](https://github.com/Stark-Industries0417/toilet_deploy/commit/21def35b54948a59e7e1675659ccf4e79c44bd3b), [a9235c6](https://github.com/Stark-Industries0417/toilet_deploy/commit/a9235c6b4fd0877f6a6469e241388040dc7f50ba), [3ca3e10](https://github.com/Stark-Industries0417/toilet_deploy/commit/3ca3e103bdf12424c5235e4acc0a81f4b6a0311c)
- 화장실 추가 API 완성(22/06/16) - `commit` : [86a5011](https://github.com/Stark-Industries0417/toilet_deploy/commit/86a5011dcf08a0fd3cb28cf1afdeb537a00c0b97)
- 리뷰 추가 API 완성(22/06/17) - `commit` : [b7ba986](https://github.com/Stark-Industries0417/toilet_deploy/commit/b7ba986bae2983f8efd024f063ff1b6d31b10d3e)
- 사용자 비밀번호 재설정 API 완성(22/06/25) - `commit` : [db2d754](https://github.com/Stark-Industries0417/toilet_deploy/commit/db2d7545d789253b3e2a0a1a50126c73fb45f809)
- 화장실 신고 API, 사용자 주변 화장실 위치 정보 반환 API 완성(22/06/30) - `commit` : [fb60eda](https://github.com/Stark-Industries0417/toilet_deploy/commit/fb60edaec27dc21aea992e291467cac41962cd02)
- 리뷰 삭제 API 완성(22/07/04) - `commit` : [8947cbc](https://github.com/Stark-Industries0417/toilet_deploy/commit/8947cbc930d73c91844604a16ccd43a6da99b2ab)
- 화장실 별 리뷰 가져오기 API 완성(22/07/05) - `commit` : [f8d6ce0](https://github.com/Stark-Industries0417/toilet_deploy/commit/f8d6ce05dff5ad6eaa47c8108b7d6e7ac9d6ddf6)
- 리뷰 수정 API 완성(22/07/07) - `commit` : [5f2272e](https://github.com/Stark-Industries0417/toilet_deploy/commit/5f2272e98aeec9f863185e27d56021e32ce54aa7)
- 리뷰 신고 API 완성(22/07/07) - `commit` : [db6164b](https://github.com/Stark-Industries0417/toilet_deploy/commit/db6164b9f771e4e436451042e8c678bb8dde28ea)
- 사용자 별 리뷰 가져오기, 해당 주소의 화장실 정보 가져오기 API 완성(22/07/08) - `commit` : [16eabba](https://github.com/Stark-Industries0417/toilet_deploy/commit/16eabba2688515e8a4e0646b22ed027fad3e19a5)
- 화장실 청결도 평균 완성(22/07/09) - `commit` : [45bf009](https://github.com/Stark-Industries0417/toilet_deploy/commit/45bf009c6ae81f8e0287a5ace0a2c2d05574f6b8)
- 화장실 사진 삭제 API, 화장실 사진 업로드 API 수정 - `commit` : [a109382](https://github.com/Stark-Industries0417/toilet_deploy/commit/a109382bb394090dc29092cfa376c83fdf6ac9ec)
- 카카오 oauth API 완성(22/07/11) - `commit` : [31d6493](https://github.com/Stark-Industries0417/toilet_deploy/commit/31d6493c39ca9ba322ec4f93aeaed281519eec0c)

## Author

👤 **Stark-Industries0417**

- Github: [@Stark-Industries0417](https://github.com/Stark-Industries0417)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
