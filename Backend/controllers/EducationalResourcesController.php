<?php
require_once '../config/database.php';

class EducationalResourcesController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Get all educational resources with optional filters
    public function getAllResources($filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Apply filters
            if (!empty($filters['type'])) {
                $whereClause .= " AND type = :type";
                $params[':type'] = $filters['type'];
            }
            
            if (!empty($filters['search'])) {
                $whereClause .= " AND (title LIKE :search OR description LIKE :search)";
                $params[':search'] = "%{$filters['search']}%";
            }
            
            $orderBy = "ORDER BY created_at DESC";
            if (!empty($filters['sort'])) {
                switch ($filters['sort']) {
                    case 'popular':
                        $orderBy = "ORDER BY download_count DESC, created_at DESC";
                        break;
                    case 'newest':
                        $orderBy = "ORDER BY created_at DESC";
                        break;
                    case 'title':
                        $orderBy = "ORDER BY title ASC";
                        break;
                }
            }
            
            $limit = $filters['limit'] ?? 20;
            $offset = $filters['offset'] ?? 0;
            
            $query = "SELECT * FROM educational_resources 
                      $whereClause 
                      $orderBy 
                      LIMIT :limit OFFSET :offset";
            
            $stmt = $this->db->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $resources = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get total count for pagination
            $countQuery = "SELECT COUNT(*) as total FROM educational_resources $whereClause";
            $countStmt = $this->db->prepare($countQuery);
            foreach ($params as $key => $value) {
                $countStmt->bindValue($key, $value);
            }
            $countStmt->execute();
            $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            return [
                'success' => true, 
                'data' => $resources,
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get a single resource by ID
    public function getResourceById($id) {
        try {
            $query = "SELECT * FROM educational_resources WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $resource = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($resource) {
                // Increment download count when viewing
                $this->incrementDownloadCount($id);
                return ['success' => true, 'data' => $resource];
            } else {
                return ['success' => false, 'error' => 'Resource not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Create a new educational resource
    public function createResource($data) {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['description']) || empty($data['type'])) {
                return ['success' => false, 'error' => 'Title, description, and type are required'];
            }
            
            $query = "INSERT INTO educational_resources 
                      (title, description, type, file_path, created_by) 
                      VALUES 
                      (:title, :description, :type, :file_path, :created_by)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description']);
            $stmt->bindValue(':type', $data['type']);
            $stmt->bindValue(':file_path', $data['file_path'] ?? null);
            $stmt->bindValue(':created_by', $data['created_by'] ?? null);
            
            if ($stmt->execute()) {
                $resourceId = $this->db->lastInsertId();
                return [
                    'success' => true, 
                    'message' => 'Educational resource created successfully',
                    'id' => $resourceId
                ];
            } else {
                return ['success' => false, 'error' => 'Failed to create educational resource'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Create resource with file upload
    public function createResourceWithFile($title, $description, $type, $file, $createdBy = null) {
        try {
            // Validate required fields
            if (empty($title) || empty($description) || empty($type)) {
                return ['success' => false, 'error' => 'Title, description, and type are required'];
            }
            
            // Upload file first
            $uploadResult = $this->uploadFile($file);
            if (!$uploadResult['success']) {
                return $uploadResult;
            }
            
            // Create resource with file path
            $data = [
                'title' => $title,
                'description' => $description,
                'type' => $type,
                'file_path' => $uploadResult['file_path'],
                'created_by' => $createdBy
            ];
            
            return $this->createResource($data);
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Handle file upload
    public function uploadFile($file) {
        try {
            // Check if file was uploaded
            if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
                return ['success' => false, 'error' => 'No file uploaded'];
            }
            
            // Check for upload errors
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $errorMessages = [
                    UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive',
                    UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive',
                    UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                    UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                    UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                    UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                    UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
                ];
                $errorMessage = $errorMessages[$file['error']] ?? 'Unknown upload error';
                return ['success' => false, 'error' => 'Upload error: ' . $errorMessage];
            }
            
            // Validate file size (max 50MB)
            $maxSize = 50 * 1024 * 1024; // 50MB
            if ($file['size'] > $maxSize) {
                return ['success' => false, 'error' => 'File size too large. Maximum size is 50MB'];
            }
            
            // Get file extension
            $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            
            // Allowed file types
            $allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov'];
            
            if (!in_array($fileExtension, $allowedTypes)) {
                return ['success' => false, 'error' => 'File type not allowed. Allowed types: ' . implode(', ', $allowedTypes)];
            }
            
            // Create upload directory if it doesn't exist
            $uploadDir = '../uploads/educational-resources/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0755, true)) {
                    return ['success' => false, 'error' => 'Failed to create upload directory'];
                }
            }
            
            // Check if directory is writable
            if (!is_writable($uploadDir)) {
                return ['success' => false, 'error' => 'Upload directory is not writable'];
            }
            
            // Generate unique filename
            $fileName = uniqid() . '_' . time() . '.' . $fileExtension;
            $filePath = $uploadDir . $fileName;
            
            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                return [
                    'success' => true,
                    'file_path' => '/uploads/educational-resources/' . $fileName,
                    'file_name' => $file['name'],
                    'file_size' => $file['size']
                ];
            } else {
                return ['success' => false, 'error' => 'Failed to move uploaded file. Check directory permissions.'];
            }
        } catch (Exception $e) {
            error_log("Upload error: " . $e->getMessage());
            return ['success' => false, 'error' => 'Upload failed: ' . $e->getMessage()];
        }
    }
    
    // Update an educational resource
    public function updateResource($id, $data) {
        try {
            $query = "UPDATE educational_resources SET 
                      title = :title, description = :description, type = :type, 
                      file_path = :file_path, updated_at = NOW()
                      WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':id', $id);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description']);
            $stmt->bindValue(':type', $data['type']);
            $stmt->bindValue(':file_path', $data['file_path'] ?? null);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Educational resource updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update educational resource'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Delete an educational resource
    public function deleteResource($id) {
        try {
            $query = "DELETE FROM educational_resources WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Educational resource deleted successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to delete educational resource'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Increment download count
    public function incrementDownloadCount($id) {
        try {
            $query = "UPDATE educational_resources SET download_count = download_count + 1 WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
        } catch (Exception $e) {
            // Silently fail for download count increment
        }
    }
    
    // Download a resource file
    public function downloadResource($id) {
        try {
            // Get resource details
            $query = "SELECT * FROM educational_resources WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $resource = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$resource) {
                return ['success' => false, 'error' => 'Resource not found'];
            }
            
            if (empty($resource['file_path'])) {
                return ['success' => false, 'error' => 'No file available for download'];
            }
            
            // Convert relative path to absolute path
            $filePath = '../uploads/educational-resources/' . basename($resource['file_path']);
            
            if (!file_exists($filePath)) {
                return ['success' => false, 'error' => 'File not found on server'];
            }
            
            // Increment download count
            $this->incrementDownloadCount($id);
            
            // Return file info for download
            return [
                'success' => true,
                'file_path' => $filePath,
                'file_name' => $resource['title'] . '.' . pathinfo($resource['file_path'], PATHINFO_EXTENSION),
                'mime_type' => $this->getMimeType($filePath)
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get MIME type for file
    private function getMimeType($filePath) {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        
        $mimeTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'mp4' => 'video/mp4',
            'avi' => 'video/x-msvideo',
            'mov' => 'video/quicktime'
        ];
        
        return $mimeTypes[$extension] ?? 'application/octet-stream';
    }
    
    // Get resource statistics
    public function getStatistics() {
        try {
            $query = "SELECT 
                        COUNT(*) as total_resources,
                        SUM(CASE WHEN type = 'document' THEN 1 ELSE 0 END) as documents,
                        SUM(CASE WHEN type = 'infographic' THEN 1 ELSE 0 END) as infographics,
                        SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as videos,
                        SUM(CASE WHEN type = 'presentation' THEN 1 ELSE 0 END) as presentations,
                        SUM(CASE WHEN type = 'guide' THEN 1 ELSE 0 END) as guides,
                        SUM(download_count) as total_downloads,
                        AVG(download_count) as avg_downloads
                      FROM educational_resources";
            
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $stats = $stmt->fetch(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $stats];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>
