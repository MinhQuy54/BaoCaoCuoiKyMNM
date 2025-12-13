from rest_framework import permissions

# Quyền cho phép Admin (is_staff) được Ghi (POST/PUT/DELETE), còn lại chỉ được Đọc (GET)
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

# Quyền cho phép Chủ sở hữu đối tượng (Review, Comment, Favorite) được sửa/xóa
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Quyền đọc cho phép tất cả
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Quyền ghi (PUT/DELETE) chỉ cho phép chủ sở hữu
        return obj.user == request.user
