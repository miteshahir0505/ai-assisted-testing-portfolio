# Assumptions

1. Site URL is always https://www.saucedemo.com/.
2. **Valid credentials:** standard_user / secret_sauce.
3. **Locked-out user credentials:** locked_out_user / secret_sauce.
4. **Username/password max length** = 256 characters.
5. Password masking enabled by default.
6. Error messages are generic (no system details).
7. Autofill depends on browser support.
8. SQL injection attempts should not expose DB errors.

# TestCases

| ID | Title | Preconditions | Steps | Test Data | Expected Result | Type | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC01 | Valid Login | User has valid credentials | 1. Navigate to ``https://www.saucedemo.com/``<br>2. Enter valid username<br>3. Enter valid password<br>4. Click Login | Username: ``standard_user``<br>Password: ``secret_sauce`` | User is redirected to inventory page | Positive | High |
| TC02 | Invalid Login | User has invalid credentials | 1. Navigate to site<br>2. Enter invalid username/password<br>3. Click Login | Username: ``wrong_user``<br>Password: ``WrongPass!`` | Error message displayed: "Invalid username or password" | Negative | High |
| TC03 | Empty Username | None | 1. Navigate to site<br>2. Leave username blank<br>3. Enter valid password<br>4. Click Login | Username: `` (empty)<br>Password: ``secret_sauce`` | Validation message displayed: "Username is required" | Boundary | High |
| TC04 | Empty Password | None | 1. Navigate to site<br>2. Enter valid username<br>3. Leave password blank<br>4. Click Login | Username: ``standard_user``<br>Password: `` (empty) | Validation message displayed: "Password is required" | Boundary | High |
| TC05 | Locked-out User | User account is locked | 1. Navigate to site<br>2. Enter locked-out username<br>3. Enter password<br>4. Click Login | Username: ``locked_out_user``<br>Password: ``secret_sauce`` | Error message displayed: "Account is locked" | Negative | High |
| TC06 | SQL Injection in Username | None | 1. Navigate to site<br>2. Enter SQL injection string as username<br>3. Enter any password<br>4. Click Login | Username: ``admin' ``OR ``'1'='1``<br>Password: ``abc123`` | Login fails, error message displayed, no bypass | Security | High |
| TC07 | SQL Injection in Password | None | 1. Navigate to site<br>2. Enter valid username<br>3. Enter SQL injection string as password<br>4. Click Login | Username: ``standard_user``<br>Password: ``abc' ``OR ``'1'='1`` | Login fails, error message displayed, no bypass | Security | High |
| TC08 | Bypass Login Attempt | None | 1. Try to access inventory page directly via URL without login | URL: ``https://www.saucedemo.com/inventory.html`` | User is redirected to login page | Security | High |
| TC09 | Saved Credentials Autofill | User has saved credentials in browser | 1. Navigate to site<br>2. Observe autofill behavior | Browser saved: Username ``standard_user``, Password ``secret_sauce`` | Username and password fields are auto-populated correctly | Positive | Medium |
| TC10 | Very Long Username | None | 1. Navigate to site<br>2. Enter username with 256 characters<br>3. Enter valid password<br>4. Click Login | Username: ``aaaaaaaa...(256 ``chars)``<br>Password: ``secret_sauce`` | Validation error or truncation handled gracefully | Boundary | Medium |
| TC11 | Very Long Password | None | 1. Navigate to site<br>2. Enter valid username<br>3. Enter password with 256 characters<br>4. Click Login | Username: ``standard_user``<br>Password: ``bbbbbb...(256 ``chars)`` | Validation error or truncation handled gracefully | Boundary | Medium |
| TC12 | Leading/Trailing Spaces in Username | None | 1. Navigate to site<br>2. Enter username with spaces before/after<br>3. Enter valid password<br>4. Click Login | Username: ``" ``standard_user ``"``<br>Password: ``secret_sauce`` | Spaces trimmed, login succeeds if credentials are valid | Edge | Medium |
| TC13 | Leading/Trailing Spaces in Password | None | 1. Navigate to site<br>2. Enter valid username<br>3. Enter password with spaces before/after<br>4. Click Login | Username: ``standard_user``<br>Password: ``" ``secret_sauce ``"`` | Spaces treated as part of password, login fails if not exact | Edge | Medium |
| TC14 | Special Characters in Username | None | 1. Navigate to site<br>2. Enter username with special characters<br>3. Enter valid password<br>4. Click Login | Username: ``user!@#``<br>Password: ``secret_sauce`` | Login succeeds if credentials are valid; otherwise error | Edge | Medium |
| TC15 | Password Masking | None | 1. Navigate to site<br>2. Enter password | Username: ``standard_user``<br>Password: ``secret_sauce`` | Password characters are masked (e.g., shown as ••••) | Security | High |
