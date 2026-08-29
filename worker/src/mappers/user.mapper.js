export function toSafeUser(user) {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role_id: user.role_id,
    school_id: user.school_id,
  };
}
