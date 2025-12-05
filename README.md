# Hệ thống Quản lý Ghi chú Nâng cao (Notes & Tasks Manager)

Đây là một dự án web hoàn chỉnh bao gồm backend Python Flask và frontend React, dùng để quản lý ghi chú và công việc cá nhân.

## Mục lục

- [Tính năng](#tính-năng)
- [Kiến trúc và Công nghệ](#kiến-trúc-và-công-nghệ)
- [Yêu cầu](#yêu-cầu)
- [Hướng dẫn Cài đặt và Chạy (Local)](#hướng-dẫn-cài-đặt-và-chạy-local)
- [Hướng dẫn Cài đặt và Chạy (Docker)](#hướng-dẫn-cài-đặt-và-chạy-docker)
- [Sử dụng Makefile](#sử-dụng-makefile)
- [Cấu trúc Dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Cấu hình cho Production](#cấu-hình-cho-production)
- [Hướng dẫn Deploy](#hướng-dẫn-deploy)

## Tính năng

- **Xác thực người dùng**: Đăng ký, đăng nhập, đăng xuất với JWT (Access & Refresh Tokens).
- **Quản lý Ghi chú**: Tạo, đọc, cập nhật, xóa (CRUD) ghi chú.
- **Editor**: Soạn thảo ghi chú bằng Markdown với tính năng xem trước.
- **Quản lý Công việc**: Tạo checklist công việc trong mỗi ghi chú.
- **Tagging**: Gán thẻ (tags) cho ghi chú và tìm kiếm theo thẻ.
- **Tìm kiếm & Lọc**: Tìm kiếm toàn văn, lọc theo thẻ, sắp xếp kết quả.
- **Chia sẻ**: Chia sẻ ghi chú với người dùng khác với quyền `viewer` hoặc `editor`.
- **API RESTful**: Toàn bộ tính năng được cung cấp qua API, có tài liệu OpenAPI (Swagger).
- **Export**: Xuất ghi chú ra định dạng Markdown.

## Kiến trúc và Công nghệ

- **Backend**:
  - **Framework**: Python 3.11+, Flask
  - **API & Docs**: Flask-Smorest (tự động tạo OpenAPI 3)
  - **ORM**: SQLAlchemy
  - **Migrations**: Flask-Migrate (dựa trên Alembic)
  - **Authentication**: Flask-JWT-Extended
  - **Validation**: Marshmallow (tích hợp trong Flask-Smorest)
  - **Database**: SQLite (dev), PostgreSQL (prod)
  - **WSGI Server**: Gunicorn
- **Frontend**:
  - **Framework**: React 18 (với Vite)
  - **Styling**: Tailwind CSS
  - **Routing**: React Router
  - **State Management**: Zustand
  - **API Client**: Axios
  - **Form Management**: React Hook Form
- **DevOps**:
  - **Containerization**: Docker, Docker Compose
  - **CI/CD**: GitHub Actions

## Yêu cầu

- Python 3.10+ và `pip`
- Node.js 18+ và `npm` hoặc `yarn`
- Docker và Docker Compose
- `make` (tùy chọn, để sử dụng các lệnh tắt)

## Hướng dẫn Cài đặt và Chạy (Local)

1.  **Clone repository:**
    ```bash
    git clone <your-repo-url>
    cd notes-app-mono
    ```

2.  **Cấu hình Backend:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # Trên Windows: venv\Scripts\activate
    pip install -r requirements.txt
    cp .env.example .env
    # Chỉnh sửa file .env nếu cần
    flask db upgrade
    flask seed
    cd ..
    ```

3.  **Cấu hình Frontend:**
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local
    cd ..
    ```

4.  **Chạy ứng dụng:**
    - Mở một terminal, chạy backend:
      ```bash
      cd backend
      flask run --port=5001
      ```
    - Mở terminal khác, chạy frontend:
      ```bash
      cd frontend
      npm run dev
      ```

- Frontend sẽ chạy tại `http://localhost:5173`.
- Backend API sẽ chạy tại `http://localhost:5001`.
- API Docs (Swagger UI) có tại `http://localhost:5001/api/docs`.

## Hướng dẫn Cài đặt và Chạy (Docker)

Đây là cách được khuyến khích để chạy ứng dụng một cách nhanh chóng.

1.  **Chuẩn bị file môi trường:**
    - Tạo file `.env` trong thư mục `backend/` từ file `.env.example`.
    - Tạo file `.env.local` trong thư mục `frontend/` từ file `.env.example`.

2.  **Build và chạy container:**
    ```bash
    docker-compose up --build
    ```
    Để chạy ở chế độ nền, thêm cờ `-d`:
    ```bash
    docker-compose up --build -d
    ```

- Frontend sẽ có thể truy cập tại `http://localhost:5173`.
- Backend API sẽ có thể truy cập tại `http://localhost:5001`.
- Để dừng các container: `docker-compose down`.

## Sử dụng Makefile

Makefile cung cấp các lệnh tiện ích để quản lý dự án.

- `make setup`: Cài đặt tất cả các dependencies cho backend và frontend.
- `make run`: Chạy cả backend và frontend ở chế độ phát triển (sử dụng `docker-compose`).
- `make stop`: Dừng các container Docker.
- `make test`: Chạy unit tests cho backend.
- `make lint`: Kiểm tra code style cho backend.
- `make docker-build`: Build các Docker image mà không khởi chạy container.
- `make migrate`: Tạo một migration mới (yêu cầu nhập tên).
- `make upgrade`: Áp dụng các migration vào database.
- `make seed`: Thêm dữ liệu mẫu vào database.

## API Documentation

Tài liệu API được tự động tạo bằng Flask-Smorest và có thể truy cập qua Swagger UI tại:
`http://localhost:5001/api/docs`

Một file `openapi.yaml` cũng được cung cấp trong thư mục `backend/` để có thể import vào các công cụ như Postman.

## Testing

- **Backend Unit Tests (Pytest)**:
  ```bash
  cd backend
  pytest
