#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Role {
    Admin,
    User,
}

impl Role {
    pub fn from_str(role: &str) -> Option<Self> {
        match role.to_lowercase().as_str() {
            "admin" => Some(Role::Admin),
            "user" => Some(Role::User),
            _ => None,
        }
    }

    pub fn to_str(&self) -> &'static str {
        match self {
            Role::Admin => "admin",
            Role::User => "user",
        }
    }
}
