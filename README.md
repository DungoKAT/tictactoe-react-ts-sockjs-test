# Overview

_Technology ที่ใช้_

-   React + Typescript
-   React Router
-   Tailwind CSS
-   Axios

# วิธีการ Run

สามารถรันได้ด้วยคำสั่ง npm run dev (ต้องรันพร้อมกับ backend)
หรือสามารถเข้าได้ผ่าน netlify url
https://tictactoe-react-javasb-ws-test.netlify.app

# วิธีออกแบบโปรแกรม และ algorithm ที่ใช้

-   เริ่มจากการสร้าง Route ก่อนว่าควรจะมี route อะไรบ้างโดยใช้ React Router เป็นตัวช่วยในการจัดการกับ route ต่างๆ
-   สร้างหน้า UI Page คร่าวๆสำหรับรองรับกับหน้าต่างๆ
-   สร้าง RequestApi สำหรับส่ง HTTP request ไปยัง backend
-   สร้าง Context สำหรับเก็บข้อมูลและฟังก์ชันต่างๆที่ใช้งานในระบบ
-   อัปเดต UI เพื่อสำหรับรองรับกับระบบต่างๆ

_Route_

สร้าง Protected Route เพื่อป้องกันการไปยัง route ที่ไม่ถูกต้อง โดยจะมี 4 routes ได้แก่

-   PublicRoute.tsx: ป้องกันการเข้าไปยังหน้า Home ถ้ายังไม่ได้ Login
-   PrivateRoute.tsx: เป็นหน้าที่เข้าได้หลังจาก Login ซึ่งข้อมูลประวัติเกมที่เล่นจะแยกกันไปในแต่ละ User
-   HomeRoute.tsx: จะอยู่ใน PrivateRoute ซึ่งจะป้องกันการไปยังหน้า Game ถ้ายังไม่ได้กดเริ่มเกม
-   GameRoute.tsx: จะอยู่ใน PrivateRoute ซึ่งจะป้องกันการไปยังหน้า Home ถ้าเกมยังไม่จบ หรือยังไม่มีการ Terminate เกม

_API_
ใช้ Axios ในการทำ HTTP Request เพื่อส่งคำขอร้องไปยัง backend
โดยจะมี method get, getWithParams, post, delete

UserRequestApi.ts
สำหรับร้องขอ Api ใน path /user

-   getAllUsers: get ข้อมูลของ User ทุกคนที่มีอยู่ในฐานข้อมูล
-   getUserById: get ข้อมูลของ User เฉพาะ id ที่ระบุ
-   registerUser: ลงทะเบียน User
-   loginUser: login user เพื่อเข้าไปยังหน้า Home
-   logoutUser: logout user เพื่อออกไปยังหน้า Login

GameRequestApi.ts
สำหรับร้องขอ Api ใน path /game

-   getAllGames: get ข้อมูลของ Game ทุกเกมที่มีอยู่ในฐานข้อมูล
-   getGameById: get ข้อมูลของ Game เฉพาะ id ที่ระบุ
-   createGame: สร้างเกมเพื่อรอเล่น
-   connectGame: เชื่อมต่อเกมด้วยการระบุ gameId
-   connectRandomGame: เชื่อมต่อเกมด้วยการสุ่ม
-   playGame: เล่นเกม เมื่อชนะจะส่งข้อมูลผู้ชนะกลับมา
-   surrenderGame: ยอมแพ้
-   terminateGame: ลบเกมนั้นๆทิ้ง (สามารถทำได้ในกรณีที่สร้างห้องไว้แล้วไม่ต้องการเล่น)

_CONTEXT_
ใช้สำหรับเป็นที่เก็บฟังก์ชันหรือข้อมูลต่างๆที่ใช้ในระบบ

UserContext.tsx
รวมฟังก์ชันต่างๆที่เกี่ยวกับระบบ Login โดยดึงฟังก์ชั่นมาจาก UserRequestApi.ts

-   register : สำหรับลงทะเบียน User เมื่อลงทะเบียนสำเร็จจะขึ้น alert บอกผู้ใช้
-   login : สำหรับ Login User เมื่อ Login สำเร็จจะขึ้น alert บอกผู้ใช้ และจะ set ค่า currentLoginId เป็น id ของ user ไว้ที่ Local Storage
-   logout : สำหรับ Logout User และจะ set ค่า currentLoginId เป็นค่าว่าง
-   isLogin : สำหรับเช็คว่ามีการ Login เข้าระบบหรือยัง โดยจะสัมพันธ์กันกับ PublicRoute.tsx และ PrivateRout.tsx
-   allUsers : ดึงข้อมูล User ทุกคน
-   currentUser : ดึงข้อมูล User ปัจจุบันที่ Login เข้าระบบ

GameContext.tsx
รวมฟังก์ชันต่างๆที่เกี่ยวกับระบบการเล่นเกม โดยดึงฟังก์ชั่นมาจาก GameRequestApi.ts
และมีการใช้ SockJs สำหรับการเล่นเกมกับผู้เล่นอื่นๆแบบ Realtime โดยดึงจาก path /game และใช้ subscribe จาก path /topic/game-progress/ สำหรับการรับส่งข้อมูลจาก backend

-   createGameRoom: สร้างเกมไว้สำหรับรอผู้เล่นอีกคน โดยผู้เล่นที่สร้างเกมจะเป็น Player X เสมอ
-   connectGameRoom: เชื่อมต่อเกมด้วย gameId โดยผู้เล่นเชื่อมต่อเกมจะเป็น Player O เสมอ
-   connectRandomGameRoom: เชื่อมต่อเกมด้วยการสุ่ม โดยผู้เล่นเชื่อมต่อเกมจะเป็น Player O เสมอ
-   playCurrentGame: เริ่มเล่นเกม จะสามารถเล่นได้ก็ต่อเมื่อมีทั้งผู้เล่น X และ O อยู่ในห้องแล้ว
-   isInGameRoom: สำหรับเช็คว่าตอนนี้อยู่ในห้องเล่นเกมหรือไม่ โดยจะสัมพันธ์กันกับ HomeRoute.tsx และ GameRoute.tsx
-   allGames: ดึงข้อมูล Game ทุกเกม
-   currentGame: ดึงข้อมูล Game ที่เรากำลังเล่น โดยจะมีการอัปเดตข้อมูลแบบ realtime
-   surrenderCurrentGame: ยอมแพ้
-   terminateCurrentGame: ลบเกมนั้นๆทิ้ง และจะไม่เก็บเข้าในประวัติเกมของผู้เล่น

_PAGE_
หน้าต่างๆที่มีในระบบ

Login Page

-   มีปุ่มสำหรับ Register เมื่อใส่ Username ที่ไม่ได้มีอยู่ในระบบ หากมีจะ alert บอกผู้ใช้ว่ามี Username นี้แล้ว เมื่อลงทะเบียนสำเร็จ หรือลงทะเบียนแล้วก็จะสามารถ login ได้
-   มีปุ่มสำหรับ Login ที่ต้องใส่ Username และ Password ให้ถูกต้อง และจะสามารถ login ได้ก็ต่อเมื่อมี Username นั้นๆอยู่ในระบบแล้วเท่านั้น

Home Page

-   ตรง Sidebar ด้านซ้ายจะมีชื่อ Username ที่ใช้งานปัจจุบัน และมีประวัติเกมของผู้ใช้งานนั้นๆ ตรงด้านล่างจะมีปุ่มสำหรับ Logout
-   เมื่อกดดู Game history จะมีบอกว่า Player X, O คือใคร บอกผู้ชนะ และสามารถกดดู Replay การเล่นได้ว่าผู้เล่นลงอะไรตรงไหนบ้าง
-   ตรงด้านขวาจะมี Game options ให้สามารถเลือกตารางได้ มี 3x3, 5x5, 7x7 โดยเมื่อเลือกขนาดตารางแล้วสามารถกด Create room หรือสามารถกด Join ด้วย gameId หรือสุ่มห้องได้ (ตรงส่วนนี้จะยังไม่สามารถเล่นกับ bot ได้)

Game Page

-   ด้านบนซ้าย และบนขวา จะมีบอกชื่อ Username ของผู้เล่น X, O
-   เมื่อยังไม่มีผู้เล่นเชื่อมต่อเข้ามา จะมีปุ่ม Leave room สำหรับออกจากห้องได้ ซึ่งจะเรียกใช้งานฟังก์ชัน terminateCurrentGame
-   เมื่อมีผู้เล่นเชื่อมต่อเข้ามา ปุ่มด้านล่างจะเปลี่ยนเป็นปุ่ม Surrender สำหรับยอมแพ้ และจะสามารถเริ่มเกมได้โดยจะเริ่มจาก Player X และมี Turn บอกด้านบนตารางว่าเป็น Turn ของใคร
-   Turn จะเป็นตัวบอกว่าตาผู้เล่นคนไหน ถ้าไม่ใช่ผู้เล่นที่สามารถเล่นใน turn นั้นๆจะไม่สามารถกดปุ่มนั้นได้
-   เมื่อเล่นจบจะขึ้นหน้าต่างว่าใครเป็นผู้ชนะ และมีปุ่มที่กลับไปยัง Home page
