# **Sui Titanium**

Withdrawing from validators in Sui is tedious. You first need to unstake all the staked reward objects, then merge them
into one, and then send them.

As far as we are aware, no web wallet supports bulk unstaking of different objects.

----

> You need your account key imported and Sui app installed on your Ledger Device

## **How to use?**

**1. Create and update** **.env** **with**

```
cp .env.example .env
```

```
VALIDATOR_ADDRESS=
REWARD_ADDRESS=
```

**2. Install Dependencies**

```
npm install
```

**3. Unstake all objects**

```
node withdraw_rewards.js
```

**4. Send to some other address**

```
node send.js
```
