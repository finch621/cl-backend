const { usersAPI, tasksAPI } = require('./src/data-sources');

(async function seed() {
  try {
    console.log('seeding..');

    for (let i = 1; i <= 20; i += 1) {
      const user = await usersAPI.create({ email: `test${i}@test.com`, password: '123456' });

      const tasksToCreate = [];

      for (let j = 1; j <= 20; j += 1) {
        // tasksToCreate.push(tasksAPI.create({ task: `task ${j}`, user_id: user.id }));
        await tasksAPI.create({ task: `task ${j}`, user_id: user.id });
      }

      // await Promise.all(tasksToCreate);
    }

    console.log('done seeding');
    process.exit(0);
  } catch (e) {
    console.log('seed err', e);
    process.exit(1);
  }
})();
