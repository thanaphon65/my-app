FROM node:22.14.0
# ตั้งค่าตำแหน่งของไฟล์ใน Container
WORKDIR /app

# คัดลอก package.json และ package-lock.json เข้าไป
COPY package*.json ./

# ติดตั้ง Dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดเข้าไปใน Container
COPY . .

# เปิดพอร์ต 3333
EXPOSE 3333

# คำสั่งเริ่มต้นรันแอป
CMD ["node", "index.js"]