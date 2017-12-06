#[no_mangle]
pub fn do_loop() -> u32 {
    let mut i: u32 = 0;
    let max = 1000000000;

    loop {
        i += 1;

        if i >= max {
            return i;
        }
    }
}
