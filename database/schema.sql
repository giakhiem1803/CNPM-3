CREATE DATABASE IF NOT EXISTS digital_learning_resources
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE digital_learning_resources;

CREATE TABLE IF NOT EXISTS roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name ENUM('STUDENT', 'LECTURER', 'ADMIN') NOT NULL UNIQUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subjects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS learning_resources (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  keywords VARCHAR(255) NULL,
  access_level ENUM('AUTHENTICATED', 'LECTURER_ONLY') NOT NULL DEFAULT 'AUTHENTICATED',
  status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  rejection_reason VARCHAR(500) NULL,
  download_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  uploader_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  INDEX idx_resources_status_created (status, created_at),
  INDEX idx_resources_subject (subject_id),
  INDEX idx_resources_category (category_id),
  CONSTRAINT fk_resources_uploader FOREIGN KEY (uploader_id) REFERENCES users(id),
  CONSTRAINT fk_resources_subject FOREIGN KEY (subject_id) REFERENCES subjects(id),
  CONSTRAINT fk_resources_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS resource_files (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NULL,
  data LONGBLOB NULL,
  mime_type VARCHAR(120) NOT NULL,
  extension VARCHAR(20) NOT NULL,
  size BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  resource_id INT UNSIGNED NOT NULL UNIQUE,
  CONSTRAINT fk_files_resource FOREIGN KEY (resource_id)
    REFERENCES learning_resources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS favorites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  UNIQUE KEY uq_favorite_user_resource (user_id, resource_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS download_histories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  downloaded_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  INDEX idx_download_user_time (user_id, downloaded_at),
  CONSTRAINT fk_downloads_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_downloads_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS approvals (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  action ENUM('APPROVED', 'REJECTED') NOT NULL,
  reason VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  resource_id INT UNSIGNED NOT NULL,
  admin_id INT UNSIGNED NOT NULL,
  INDEX idx_approvals_resource (resource_id),
  CONSTRAINT fk_approvals_resource FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE,
  CONSTRAINT fk_approvals_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  details TEXT NULL,
  created_at DATETIME NOT NULL,
  user_id INT UNSIGNED NULL,
  INDEX idx_activity_created (created_at),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Sau khi tạo schema, chạy `npm run seed --prefix backend` để tạo vai trò,
-- tài khoản demo, danh mục và danh sách môn học.
