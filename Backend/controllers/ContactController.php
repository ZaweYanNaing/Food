<?php
require_once '../config/database.php';

class ContactController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Submit a contact message
    public function submitMessage($data) {
        try {
            // Validate required fields
            if (empty($data['name']) || empty($data['email']) || empty($data['subject']) || empty($data['message'])) {
                return ['success' => false, 'error' => 'All fields are required'];
            }
            
            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return ['success' => false, 'error' => 'Please enter a valid email address'];
            }
            
            // Sanitize input
            $name = trim($data['name']);
            $email = trim($data['email']);
            $subject = trim($data['subject']);
            $message = trim($data['message']);
            
            // Check for spam (basic validation)
            if (strlen($message) < 10) {
                return ['success' => false, 'error' => 'Message must be at least 10 characters long'];
            }
            
            if (strlen($message) > 2000) {
                return ['success' => false, 'error' => 'Message must be less than 2000 characters'];
            }
            
            $query = "INSERT INTO contact_messages (name, email, subject, message) 
                      VALUES (:name, :email, :subject, :message)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':email', $email);
            $stmt->bindValue(':subject', $subject);
            $stmt->bindValue(':message', $message);
            
            if ($stmt->execute()) {
                $messageId = $this->db->lastInsertId();
                
                return [
                    'success' => true, 
                    'message' => 'Thank you for your message! We will get back to you soon.',
                    'id' => $messageId
                ];
            } else {
                return ['success' => false, 'error' => 'Failed to send message. Please try again.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => 'An error occurred while sending your message.'];
        }
    }
    
    // Get all contact messages (admin function)
    public function getAllMessages($filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Apply filters
            if (!empty($filters['status'])) {
                $whereClause .= " AND status = :status";
                $params[':status'] = $filters['status'];
            }
            
            if (!empty($filters['search'])) {
                $whereClause .= " AND (name LIKE :search OR email LIKE :search OR subject LIKE :search OR message LIKE :search)";
                $params[':search'] = "%{$filters['search']}%";
            }
            
            $query = "SELECT * FROM contact_messages 
                      $whereClause 
                      ORDER BY created_at DESC";
            
            $stmt = $this->db->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $messages];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get a single contact message by ID
    public function getMessageById($id) {
        try {
            $query = "SELECT * FROM contact_messages WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $message = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($message) {
                return ['success' => true, 'data' => $message];
            } else {
                return ['success' => false, 'error' => 'Message not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Update message status
    public function updateMessageStatus($id, $status) {
        try {
            $allowedStatuses = ['new', 'read', 'replied', 'archived'];
            if (!in_array($status, $allowedStatuses)) {
                return ['success' => false, 'error' => 'Invalid status'];
            }
            
            $query = "UPDATE contact_messages SET status = :status, updated_at = NOW() WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Message status updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update message status'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get message statistics
    public function getMessageStats() {
        try {
            $query = "SELECT 
                        COUNT(*) as total_messages,
                        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_messages,
                        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_messages,
                        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_messages,
                        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as messages_last_week
                      FROM contact_messages";
            
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
