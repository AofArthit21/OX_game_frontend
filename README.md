# ♟️ OX Game Frontend (Next.js)

Backend: [OX Game Backend (NestJS)](https://github.com/AofArthit21/OX_game_backend)

โปรเจกต์นี้คือส่วน **Frontend** สำหรับแอปพลิเคชันเกม OX WebApp สร้างด้วย [Next.js App Router](https://nextjs.org/docs/app) โดยใช้ **Tailwind CSS** และ **Zustand** ในการจัดการสถานะ เพื่อเชื่อมต่อกับ NestJS Backend

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```
สำหรับ Local ควร Run Server ก่อนจะ Run Next เพื่อให้ Next Run ที่ http://localhost:3001
Open [http://localhost:3001](https://www.google.com/search?q=http://localhost:3001) with your browser to see the result.

### ⚙️ Environment Variables

โปรเจกต์นี้ต้องการไฟล์ `.env.local` เพื่อกำหนด URL ของ NestJS Backend:

```dotenv
# .env.local
NEXT_PUBLIC_NEST_API_BASE_URL=http://localhost:3000
# หรือ URL ของ NestJS Backend ที่ Deploy แล้ว (เช่น [https://api.oxgame.com](https://api.oxgame.com))

```

---

## 🛠️ Key Technologies & Architecture

| Technology | Role | Details |
| --- | --- | --- |
| **Framework** | Next.js | App Router, Server Components/Client Components. |
| **State** | Zustand | จัดการสถานะเกม (Board, Score) และ JWT Token ทั่วทั้งแอปพลิเคชัน |
| **Styling** | Tailwind CSS | Utility-first CSS สำหรับการออกแบบ UI ที่สวยงามและ Responsive |
| **API** | Axios | ใช้ในการสื่อสารกับ NestJS Backend |
| **Auth** | JWT | รับ Token จาก Backend และใช้สำหรับ Protected API Calls |

---

## 🧩 Component and Flow Breakdown

### 1. Game State Management (`/store/gameStore.ts`)

ใช้ Zustand ในการเก็บสถานะหลักของเกมและผู้เล่น:

* **State:** `board`, `gameStatus` ("PLAYING", "WIN", "LOSE", "DRAW"), `playerToken`, `score`, `consecutiveWins`.
* **Actions:** `setToken`, `resetGame`, `updateScore`.

### 2. API Communication (`/lib/api.ts`)

การตั้งค่า Axios เพื่อจัดการการสื่อสารกับ Backend:

* **Base URL:** กำหนดตาม `NEXT_PUBLIC_NEST_API_BASE_URL`.
* **Interceptor:** ทุก Request จะถูกแทรก **JWT Token** จาก Zustand Store ลงใน Header `Authorization: Bearer <token>` โดยอัตโนมัติ เพื่อยืนยันตัวตนก่อนการเรียก API .

### 3. Game Interaction (`/components/GameBoard.tsx` & `/components/GameBoard/Square.tsx`)

* **`Square` Component:** จัดการ `onClick` event เมื่อผู้เล่นเดินเกม
* ส่ง Request ไปยัง `/api/game/move` พร้อมข้อมูลกระดานปัจจุบัน (`currentBoard`) และตำแหน่งที่เดิน (`playerIndex`).
* รับการตอบกลับจาก Backend เพื่ออัปเดต `board`, `gameStatus`, และ `score`.


* **`GameBoard` Component:** แสดงผลกระดาน 3x3, คะแนนรวม, และข้อความสถานะเกม.

### 4. Authentication Flow (`/app/page.tsx` & `SocialLoginButton.tsx`)

* **Login Initiation:** เมื่อผู้ใช้คลิกปุ่ม Social Login จะถูก Redirect ไปยัง URL ของ NestJS OAuth Endpoint (`/api/auth/google`).
* **Token Handling (useEffect):**
* ดึง Token ที่ถูกส่งกลับมาใน Query Parameter (e.g., `?token=...`) หลังจากการ Login สำเร็จ.
* บันทึก Token ลงใน **Local Storage** และ Zustand Store (`setToken`) และลบ Query Parameter ออกจาก URL เพื่อความสะอาด.



### 5. 🏆 Leaderboard (`/components/Leaderboard.tsx`)

* **Fetching:** ดึงข้อมูลจาก `/api/game/leaderboard` โดยใช้ `useEffect`.
* **Real-time Update:** มีการตั้งค่า **Polling** ให้ดึงข้อมูล Leaderboard ใหม่ทุก 300 วินาที (`setInterval`).
* **Ranking:** แสดงผลผู้เล่น 3 อันดับแรกด้วยสไตล์เหรียญ 🥇🥈🥉 ที่โดดเด่น.

---

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

```