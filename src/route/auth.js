// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')

User.create({
  email: 'user@mail.com',
  password: 123,
  role: 1,
})

// User.create({
//   email: 'admin@mail.com',
//   password: 123,
//   role: 2,
// })
// User.create({
//   email: 'dev@mail.com',
//   password: 123,
//   role: 3,
// })
// User.create({
//   email: 'user1@mail.com',
//   password: 123,
//   role: 1,
// })

// ================================================================

router.get('/signup', function (req, res) {
  res.render('signup', {
    name: 'signup',

    component: [
      'back-button',
      'field',
      'field-password',
      'field-checkbox',
      'field-select',
    ],

    title: 'Signup page ',

    data: {
      role: [
        { value: User.USER_ROLE.USER, text: 'Користувач' },
        {
          value: User.USER_ROLE.ADMIN,
          text: 'Адміністратор',
        },
        {
          value: User.USER_ROLE.DEVELOPER,
          text: 'Розробник',
        },
      ],
    },
  })
})

router.post('/signup', function (req, res) {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "Помилка. Обов'язкові поля відсутні",
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(401).json({
        message: 'Користувач з таким e-mail вже уснує',
      })
    }

    const newUser = User.create({ email, password, role })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'Користувач успішно зареєстрований',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      // message: error.message,
      message: 'Помилка створення користувача',
    })
  }
})

// ================================================================

module.exports = router
