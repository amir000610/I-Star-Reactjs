import express, { response } from "express"
import mysql2 from "mysql2"
import cors from "cors"
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import session from "express-session"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import { faEyeLowVision } from "@fortawesome/free-solid-svg-icons"

dotenv.config()


const salt = 10
const app = express ()
app.use(cors({
    origin: ["http://localhost:3000","https://irshad-istar.com"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

//Check Connection
const db = mysql2.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

app.get("/" , (req,res) => {
    res.json("hello")
})

app.use(express.json())

//Login & Register
app.post("/register", (req, res) => {
  const sql = "INSERT INTO login (name,email,password,role) VALUES(?)";
  const { name, email, password } = req.body;

  bcrypt.hash(password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "error for hashing the password" });
    const values = [
      name,
      email,
      hash,
      'Tutor'
    ];

    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Inserting data Error in Server" });

      // Send the confirmation email
      const transporter = nodemailer.createTransport({
        host: process.env.MAILERHOST,
        port: process.env.MAILERPORT,
        secure: process.env.MAILERSECURE,
        auth: {
          user:  process.env.MAILERUSER,
          pass:  process.env.MAILERPASS,
        },
      });

      const mailOptions = {
        from: process.env.MAILERUSER,
        to: email,
        subject: 'Registration Successful',
        html: `
          <h1>Thank you for registering! Here is your credential</h1>
          <p>Name: ${name}</p>
          <p>Email: ${email}</p>
          <p>Password: ${password}</p>
          <p>Here is the link to the system: https://irshad-istar.com</p>
          <p>Please keep this information secure and do not share it with anyone who is not authorized to access the system.</p>
          <p>If you have any questions or encounter any issues during the login process, feel free to reach out our team at:</p>
          <ul>
          <li>sabrina@irshad.com.my</li>
          <li>vicknesh@irshad.com.my</li>  
          <li>suaidah@irshad.com.my</li>
          </ul>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.json({ Status: "Success" });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login WHERE email = ?"
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json ({Error: 'Login error in server'})
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
      req.session.role = data[0].role
      req.session.user = data[0].login_id
      req.session.name = data[0].name
      if (err) return res.json ({Error: 'password compare error'})
      if (response) {
        const name = data[0].name
        const token = Jwt.sign({name}, 'jwt-secret-key', {expiresIn: '1d'})
        res.cookie('token', token)
        return res.json ({Status: 'Success'})
      } else {
        return res.json ({Error: 'password not matched'})
      }
      }) 
  }})
})


//Verify
app.post('/', (req, res) => {
  if (req.session.role ) {
    return res.json({ valid: true, role: req.session.role, name: req.session.name, loginid: req.session.user });
  } else {
    return res.json({ valid: false, error: 'User not found' });
  }
});

//LogOut
app.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.clearCookie('connect.sid')
  return res.json({Status: 'Success'})
})

//Tutor
app.get("/tutor" , (req,res) => {
  const sql = "SELECT * FROM login";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})



//Schedule
app.get("/schedule" , (req,res) => {
  const sql = "SELECT * FROM schedule JOIN institution ON schedule.institution_id = institution.institution_id JOIN module ON module.module_id = schedule.module_id JOIN login ON login.login_id = schedule.login_id ORDER BY date DESC";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//ViewAttendance
app.get("/viewschedule" , (req,res) => {
  const sql = "SELECT * FROM `student` WHERE institution_id = ?";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//AddNewSchedule
app.post("/addform", (req,res) => {
  const { data1,data2,data3,data4,data6 } = req.body
  const sql = "INSERT INTO schedule (login_id,institution_id,module_id,class,date) VALUES(?)"
  const values = [
    data1,
    data2,
    data3,
    data4,
    data6,
  ];

  db.query(sql, [values],(err,data) => {
      if (err) console.log(err)
      console.log("successfull")
      return res.send(data)
  })
})

app.post("/addform2", (req,res) => {
  const { data7 } = req.body
  const sql = "UPDATE  schedule SET complete = 1 WHERE schedule.schedule_id = ?"
  

  db.query(sql, [data7],(err,data) => {
      if (err) console.log(err)
      console.log("successfull")
      return res.send(data)
  })
})

//DeleteSchedule
app.post("/deleteschedule", (req,res)=>{
  const attendanceId = req.body.id;
  const q = "DELETE FROM schedule where schedule_id = ?"
  
  db.query(q, [attendanceId],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})


//Student
app.get("/getpd" , (req,res) => {
  const sql = "SELECT * FROM student JOIN institution ON student.institution_id = institution.institution_id JOIN schedule ON schedule.institution_id = institution.institution_id JOIN module ON module.module_id = schedule.module_id ORDER BY full_name";
  db.query(sql, (err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})



app.get("/getpdttr" , (req,res) => {
  const sql = "SELECT * FROM student JOIN institution ON student.institution_id = institution.institution_id JOIN schedule ON schedule.institution_id = institution.institution_id JOIN module ON module.module_id = schedule.module_id JOIN attendance ON attendance.scholar_id = student.scholar_id AND attendance.schedule_id = schedule.schedule_id";
  db.query(sql, (err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})


app.get("/getpd3" , (req,res) => {
  const sql = "SELECT * FROM student JOIN institution ON student.institution_id = institution.institution_id";
  db.query(sql, (err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//Student with Filtered Data
app.get("/getpd2" , (req,res) => {
  const {currentIns} = req.body
  const sql = "SELECT * FROM student JOIN institution ON student.institution_id = institution.institution_id WHERE student.institution_id = ?";
  db.query(sql, [currentIns], (err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//AddStudent
app.post("/addpd" , (req,res) => {
  const instiname = req.body.data1
  const sql2 = "SELECT institution.institution_id FROM institution WHERE institution.institution_name = ?"
  db.query(sql2,[instiname], (err,data) => {
    if (err) console.log(err)
    const instiid = data[0]?.institution_id
    const sql = "INSERT INTO student (institution_id,scholar_id,commencement_date,completion_date,full_name,ic_number,age,level,ic_state,status_on_programme,date_of_birth,gender,ethnicity,scholar_school,qualification,academic_result,scholar_martial,scholar_employer,scholar_job_position,monthly_income,home_address_line_1,home_address_line_2,home_address_line_3,home_address_city,home_address_postcode,home_address_state,mailing_address_line_1,mailing_address_line_2,mailing_address_line_3,mailing_address_city,mailing_address_postcode,mailing_address_state,house_tel_number,mobile_number,email,bank_name,bank_account_no,emergency_contact_name,emergency_contact_number,emergency_contact_number_alt,emergency_contact_relationship,father_guardian,father_guardian_ic,father_guardian_occupation,father_guardian_employer,mother_guardian_name,mother_guardian_ic,mother_guardian_occupation,mother_guardian_employers,number_of_household,number_of_household_member_employed,total_of_household_income,cohort,class_AAP_eng,class_AAP_math,class_Ndp) VALUES(?)"
  const values = [
    instiid, 
    req.body.data2,
    req.body.data3,
    req.body.data4,
    req.body.data5,
    req.body.data6,
    req.body.data7,
    req.body.data8,
    req.body.data9,
    req.body.data10,
    req.body.data11,
    req.body.data12,
    req.body.data13,
    req.body.data14,
    req.body.data15,
    req.body.data16,
    req.body.data17,
    req.body.data18,
    req.body.data19,
    req.body.data20,
    req.body.data21,
    req.body.data22,
    req.body.data23,
    req.body.data24,
    req.body.data25,
    req.body.data26,
    req.body.data27,
    req.body.data28,
    req.body.data29,
    req.body.data30,
    req.body.data31,
    req.body.data32,
    req.body.data33,
    req.body.data34,
    req.body.data35,
    req.body.data36,
    req.body.data37,
    req.body.data38,
    req.body.data39,
    req.body.data40,
    req.body.data41,
    req.body.data42,
    req.body.data43,
    req.body.data44,
    req.body.data45,
    req.body.data46,
    req.body.data47,
    req.body.data48,
    req.body.data49,
    req.body.data50,
    req.body.data51,
    req.body.data52,
    req.body.data53,
    req.body.data54,
    req.body.data55,
    req.body.data56,
  ];
  db.query(sql, [values],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
  })
})

//Delete
app.post("/deletestudent", (req,res)=>{
  const scholarId = req.body.id;
  const q = "DELETE FROM student where scholar_id = ?"
  
  db.query(q, [scholarId],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})

app.post("/deleteregtutor", (req,res)=>{
  const loginId = req.body.id;
  const q = "DELETE FROM login where login_id = ?"
  
  db.query(q, [loginId],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})

//Attendance
app.use('/attendance' , (req, res) => {
  const sql = "SELECT * FROM student b,institution c,schedule a WHERE b.institution_id = c.institution_id AND a.institution_id = b.institution_id";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//Attendance Check
app.post("/check" , (req,res) => {
  const sql = "INSERT INTO attendance (schedule_id,att_bool,reason,other_reason) VALUES(?)"
  const values = [
    req.body.data1,
    req.body.data2,
    req.body.data3,
    req.body.data4,
  ];

  db.query(sql, [values],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})

//store array
app.post('/saveOtherRes', async (req, res) => {
  const { otherres, comment, commentid } = req.body
  console.log(otherres)
  const sql = "INSERT INTO attendance (schedule_id,scholar_id,att_bool,other_reason) VALUES (?, ?, ?, ?)";

  otherres.forEach((item) => {
    if (item) {
      const { schid, stdid, checkstd, rsnmessage } = item;
      db.query(sql, [schid, stdid, checkstd, rsnmessage], (err, data) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  if (comment) {
    const commentSql = "UPDATE schedule SET schedule.comment = ? WHERE schedule.schedule_id = ?";
    db.query(commentSql, [comment, commentid], (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.send("Otherres array saved successfully");
});

app.post('/saveOtherRes2', async (req, res) => {
  const { otherres, comment, commentid } = req.body
  const sql = "UPDATE attendance SET reason = ?, ttr_bool = ?, other_reason  = ? WHERE attendance.schedule_id = ? AND attendance.scholar_id = ?";

  otherres.forEach((item) => {
    if (item) {
      const { reason,checkstd,rsnmessage,schid, stdid} = item;
      db.query(sql, [reason,checkstd,rsnmessage,schid, stdid], (err, data) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  if (comment) {
    const commentSql = "UPDATE schedule SET schedule.comment_ttr = ? WHERE schedule.schedule_id = ?";
    db.query(commentSql, [comment, commentid], (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  }

  res.send("Otherres array saved successfully");
});

//FetchAttendance
app.use('/attsubmitted' , (req, res) => {
  const sql = "SELECT * FROM attendance";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//Institution
app.get("/institution" , (req,res) => {
  const sql = "SELECT * FROM institution";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//AddInstitution
app.post("/addinsti", (req, res) => {
  const sql =
    "INSERT INTO institution (institution_name,cost_center_code,programme_partner_manager,learning_training_institutions,programme_name,sponsorship_model,sector_industry) VALUES(?,?,?,?,?,?,?)";
  const values = [
    req.body.data1,
    req.body.data2,
    req.body.data3,
    req.body.data4,
    req.body.data5,
    req.body.data6,
    req.body.data7,
  ];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error inserting data" });
    }
    console.log("Successful insert institution");
    return res.json({ message: "Data inserted successfully" });
  });
});

//Module
app.get("/module" , (req,res) => {
  const sql = "SELECT * FROM module ORDER BY module_name ASC";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

//AddModule
app.post("/addmodule" , (req,res) => {
  const sql = "INSERT INTO module (module_name,hour,type) VALUES(?)"
  const values = [
    req.body.data2,
    req.body.data3,
    req.body.data4,
  ];

  db.query(sql, [values],(err,data) => {
      if (err) console.log(err)
      console.log("successfull")
      return res.send(data)
  })
})

//EditModule
app.post("/editmodule" , (req,res) => {
  const { editid } = req.body
  const sql = "UPDATE module SET module.module_name = ? , module.type = ? WHERE module.module_id = ?"
  const values = [
    editid.module_name,
    editid.type,
    editid.module_id
  ];

  db.query(sql, [editid.module_name,editid.type,editid.module_id],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})

//DeleteModule
app.post("/deletemodule", (req,res)=>{
      const moduleId = req.body.id;
      const q = "DELETE FROM module where module_id = ?"
      
      db.query(q, [moduleId],(err,data) => {
          if (err) console.log(err)
          return res.send(data)
      })
  })

//Update module part
app.get("/edit/:id", (req,res)=>{
  const sql = "SELECT * FROM module where ID = ?";
  const id = rq.params.id
  
  db.query(q, [id],(err,data) => {
      if (err) console.log(err)
      return res.send(data)
  })
})

app.get("/getinfo" , (req,res) => {
  const sql = "SELECT status_on_programme, COUNT(*) AS total FROM student WHERE institution_id = 8 GROUP BY status_on_programme;";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})


app.get("/getinfo3" , (req,res) => {
  const sql = "SELECT status_on_programme, COUNT(*) AS total FROM student WHERE institution_id IN (1,2,3,4,5,6) GROUP BY status_on_programme";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})

app.get("/jkm" , (req,res) => {
  const sql = "SELECT institution.institution_id, institution.institution_name AS institution_name, student.status_on_programme, COUNT(*) AS total FROM student JOIN institution ON student.institution_id = institution.institution_id WHERE institution.institution_id IN (1,2,3,4,5,6) GROUP BY institution.institution_id, student.status_on_programme;";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      else {
        const studentTotals = data.map(row => ({
          institution_id: row.institution_name,
          status: row.status_on_programme,
          total: row.total,
        }));
        res.json(studentTotals);
      }
  }) 
})

app.get("/getinfo5" , (req,res) => {
  const sql = "SELECT CASE WHEN status_on_programme IN ('incomplete', 'completed') THEN 'incomplete/complete'ELSE status_on_programme END as combined_status, COUNT(*) AS total FROM student WHERE institution_id IN (1,2,3,4,5,6,8) AND status_on_programme IN ('active', 'incomplete', 'completed')GROUP BY combined_status";
  db.query(sql,(err,data) => {
      if (err) return res.json(err)
      return res.json(data)
  })
})


app.listen(8000, () => (
    console.log('Connect')
)) 

