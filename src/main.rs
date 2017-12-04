#[no_mangle]
pub fn doLoop() -> bool {
    let mut i: u32 = 0;
    let max = 1000000000;

    loop {
        i += 1;

        if i == max - 1 {
            return true;
        }
    }
}
