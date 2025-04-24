import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserRoleProps {
  role: string;
  onChange: (value: string) => void;
}

const UserRole = ({ role, onChange }: UserRoleProps) => {
  return (
    <Select value={role} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default UserRole;
