use uuid::Uuid;

pub fn generate_new_uuid_v4() -> Uuid {
    let uuid = Uuid::new_v4();
    uuid
}
