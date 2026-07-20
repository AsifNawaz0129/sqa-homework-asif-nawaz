### Data-layer reasoning 

#### 1. Keeping Chat Private by Saving Less
To protect user privacy, we don't save full chat conversations. Instead, we store general session information like duration, message count, message length, and $ASK reward status. This allows understanding chat usage without sensitive content.
`chat_session_metadata`: (`session_id`, `user_id`, `session_start_time`, `session_end_time`, `message_count`, `total_characters`, `ask_reward_status`)

#### 2. Creating New Accounts
When users sign up, we create a `users` record and a `wallets` record.
`users`: (`user_id`, `email`, `password_hash`, `created_at`, `verified_at`, `phone_number`, `country`, `date_of_birth`)
`wallets`: (`wallet_id`, `user_id`, `is_active`, `ask_balance_pending`, `ask_balance_confirmed`)

#### 3. SQL Queries to Check Our Data
These queries ensure data consistency.

**Query 1: Check New User and Wallet**
Confirms new users (last hour) have an associated wallet.

```sql
SELECT
    u.user_id,
    u.email,
    u.created_at,
    w.wallet_id
FROM
    users u
JOIN
    wallets w ON u.user_id = w.user_id
WHERE
    u.created_at >= NOW() - INTERVAL '1 hour';
```

**Query 2: Check for Orphaned Session Metadata**
Identifies session metadata not linked to an active user, indicating a data integrity problem.

```sql
SELECT
    csm.session_id,
    csm.user_id,
    csm.session_start_time
FROM
    chat_session_metadata csm
LEFT JOIN
    users u ON csm.user_id = u.user_id
WHERE
    csm.user_id IS NOT NULL
    AND u.user_id IS NULL;
```

**Query 3: Check Timestamps and Wallet Status**
Ensures logical order (e.g., `verified_at` >= `created_at`) and that active wallets belong to verified accounts.

```sql
-- Check for logical timestamp issues
SELECT
    user_id,
    created_at,
    verified_at
FROM
    users
WHERE
    verified_at < created_at;

-- Check for active wallets on unverified accounts
SELECT
    w.wallet_id,
    w.user_id
FROM
    wallets w
JOIN
    users u ON w.user_id = u.user_id
WHERE
    w.is_active = TRUE
    AND u.verified_at IS NULL;
```

#### 4. Checking for Duplicates in Our Analytics
We prevent counting the same action multiple times. If an internet issue or accidental clicks create duplicate session records, our analytics get skewed, and $ASK tokens might be over-credited.
We compare all incoming session IDs to their unique count. Any difference means duplicates. These extra records are "quarantined."
This ensures accurate reports, fair $ASK token distribution, and trustworthy data.
