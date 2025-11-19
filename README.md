# **Sui Titanium**

Withdrawing from validators in Sui is tedious. You first need to unstake all the staked reward objects, then merge them
into one, and then send them.

As far as we are aware, no web wallet supports bulk unstaking of different objects.

----

## **How to use?**

**1. Create and update** **.env** **with**

```
cp .env.example .env
```

```
VALIDATOR_ADDRESS=0x01d03daf1dc3540b62014b0a6837f21ba72bf9218d6c4b3a2ee65465dde26ff7
REWARD_ADDRESS=0xcc0a57648d1e09f7322f5804829568194dca637c3d9c1dd927081de14e7bad19
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