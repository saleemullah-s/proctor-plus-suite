import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Lock,
  ArrowLeft,
  Edit,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Simulated user data - in real app this would come from auth context
  const [userType] = useState<"admin" | "student">("admin"); // This would be dynamic
  
  const [profileData, setProfileData] = useState({
    name: userType === "admin" ? "Dr. Sarah Johnson" : "John Smith",
    email: userType === "admin" ? "sarah.johnson@college.edu" : "john@college.edu",
    phone: userType === "admin" ? "+1 (555) 123-4567" : "+1 (555) 987-6543",
    department: userType === "admin" ? "Computer Science Department" : "Computer Science",
    address: "123 University Ave, College City, ST 12345",
    joinDate: userType === "admin" ? "2020-08-15" : "2023-09-01",
    studentId: userType === "student" ? "CS2024001" : undefined,
    role: userType === "admin" ? "Administrator" : "Student"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card shadow-card border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(userType === "admin" ? "/admin/dashboard" : "/student/dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-card-foreground">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account information and preferences</p>
              </div>
            </div>
            <Badge variant={userType === "admin" ? "default" : "secondary"} className="capitalize">
              {profileData.role}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="p-4 rounded-full bg-primary-light mx-auto mb-4 w-fit">
                  {userType === "admin" ? (
                    <Shield className="h-12 w-12 text-primary" />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{profileData.name}</h3>
                <p className="text-muted-foreground mb-4">{profileData.role}</p>
                {profileData.studentId && (
                  <Badge variant="outline" className="mb-4">
                    ID: {profileData.studentId}
                  </Badge>
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="security">Security Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and contact information</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? (
                          <>Cancel</>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={profileData.department}
                            onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>

                        {profileData.studentId && (
                          <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input
                              id="studentId"
                              value={profileData.studentId}
                              disabled
                              className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Student ID cannot be modified</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex gap-3">
                          <Button type="submit" variant="hero">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Update your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Password Change Form */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="Enter your current password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                              onClick={() => togglePasswordVisibility("current")}
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Enter your new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm your new password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                              onClick={() => togglePasswordVisibility("confirm")}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium text-card-foreground mb-2">Password Requirements:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• At least 8 characters long</li>
                            <li>• Include uppercase and lowercase letters</li>
                            <li>• Include at least one number</li>
                            <li>• Include at least one special character</li>
                          </ul>
                        </div>

                        <Button type="submit" variant="hero">
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </form>
                    </div>

                    <Separator />

                    {/* Account Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-card-foreground">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium text-card-foreground">Account Type</p>
                          <p className="text-muted-foreground">{profileData.role}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium text-card-foreground">Member Since</p>
                          <p className="text-muted-foreground">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium text-card-foreground">Last Login</p>
                          <p className="text-muted-foreground">Today, 2:30 PM</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="font-medium text-card-foreground">Status</p>
                          <Badge variant="default" className="mt-1">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;