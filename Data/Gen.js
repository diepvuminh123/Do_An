const fs = require('fs');
const data_authen = [
    {
        "id": "u123456",
        "username": "nguyen_van_a",
        "email": "nguyenvana@example.com",
        "password": "Minh123",
        "fullName": "Nguyễn Văn A",
        "phone": "0912345678",
        "address": "123 Đường Lê Lợi, Quận 1, TP.HCM",
        "role": "user",
        "createdAt": "2025-03-15T08:30:00Z",
        "lastLogin": "2025-04-04T14:25:30Z",
        "status": "active"
      },
      {
        "id": "u1234567",
        "username": "nguyen_van_b",
        "email": "nguyenvana@example.com",
        "password": "b1234",
        "fullName": "Nguyễn Văn A",
        "phone": "0912345678",
        "address": "123 Đường Lê Lợi, Quận 2, TP.HCM",
        "role": "user",
        "createdAt": "2024-03-15T08:30:00Z",
        "lastLogin": "2024-04-04T14:25:30Z",
        "status": "active"
      },
      {
        "id": "a789012",
        "username": "admin_tran_b",
        "email": "tranb@example.com",
        "password": "admin123",
        "fullName": "Trần Thị B",
        "phone": "0987654321",
        "permissions": [    
            "view_users",
          "system_settings"
        ],
        "role": "admin",
        "createdAt": "2024-10-05T10:00:00Z",
        "lastLogin": "2025-04-05T09:15:45Z",
        "status": "active"
      }
];
//worm
const wormcatalog = {
  type: "worm",
  inputSpeed: 1750, // RPM
  data: [
    // Box Size 30
    {
      boxSize: 30,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 0.70,
        outputTorque: 160, // lbs.in.
        outputSpeed: 233
      },
      efficiency: 85, // %
      ohl: 143, // lbs.
      outputShaftThrustLoad: 29, // lbs.
      backlash: {
        min: 13.8, // Angular minutes (')
        max: 28.8
      }
    },
    {
      boxSize: 30,
      ratio: "10:1",
      mechanical: {
        inputHP: 0.54,
        outputTorque: 160,
        outputSpeed: 175
      },
      efficiency: 83,
      ohl: 157,
      outputShaftThrustLoad: 31,
      backlash: {
        min: 13.8,
        max: 28.8
      }
    },
    {
      boxSize: 30,
      ratio: "15:1",
      mechanical: {
        inputHP: 0.38,
        outputTorque: 160,
        outputSpeed: 117
      },
      efficiency: 78,
      ohl: 180,
      outputShaftThrustLoad: 36,
      backlash: {
        min: 13.8,
        max: 28.8
      }
    },
    {
      boxSize: 30,
      ratio: "20:1",
      mechanical: {
        inputHP: 0.28,
        outputTorque: 151,
        outputSpeed: 88
      },
      efficiency: 74,
      ohl: 198,
      outputShaftThrustLoad: 40,
      backlash: {
        min: 13.2,
        max: 28.2
      }
    },
    {
      boxSize: 30,
      ratio: "25:1",
      mechanical: {
        inputHP: 0.30,
        outputTorque: 185,
        outputSpeed: 70
      },
      efficiency: 69,
      ohl: 213,
      outputShaftThrustLoad: 43,
      backlash: {
        min: 13.2,
        max: 27.0
      }
    },
    {
      boxSize: 30,
      ratio: "30:1",
      mechanical: {
        inputHP: 0.25,
        outputTorque: 177,
        outputSpeed: 58
      },
      efficiency: 66,
      ohl: 226,
      outputShaftThrustLoad: 45,
      backlash: {
        min: 13.8,
        max: 28.8
      }
    },
    {
      boxSize: 30,
      ratio: "40:1",
      mechanical: {
        inputHP: 0.19,
        outputTorque: 160,
        outputSpeed: 44
      },
      efficiency: 60,
      ohl: 249,
      outputShaftThrustLoad: 50,
      backlash: {
        min: 13.2,
        max: 28.2
      }
    },
    {
      boxSize: 30,
      ratio: "50:1",
      mechanical: {
        inputHP: 0.15,
        outputTorque: 151,
        outputSpeed: 35
      },
      efficiency: 56,
      ohl: 268,
      outputShaftThrustLoad: 54,
      backlash: {
        min: 13.2,
        max: 27.0
      }
    },
    {
      boxSize: 30,
      ratio: "60:1",
      mechanical: {
        inputHP: 0.12,
        outputTorque: 134,
        outputSpeed: 29
      },
      efficiency: 52,
      ohl: 285,
      outputShaftThrustLoad: 57,
      backlash: {
        min: 12.6,
        max: 25.8
      }
    },
    {
      boxSize: 30,
      ratio: "80:1",
      mechanical: {
        inputHP: 0.08,
        outputTorque: 109,
        outputSpeed: 22
      },
      efficiency: 45,
      ohl: 314,
      outputShaftThrustLoad: 63,
      backlash: {
        min: 12.6,
        max: 25.8
      }
    },
    // Box Size 40
    {
      boxSize: 40,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 1.50,
        outputTorque: 353,
        outputSpeed: 233
      },
      efficiency: 87,
      ohl: 274,
      outputShaftThrustLoad: 55,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "10:1",
      mechanical: {
        inputHP: 1.21,
        outputTorque: 370,
        outputSpeed: 175
      },
      efficiency: 85,
      ohl: 302,
      outputShaftThrustLoad: 60,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "15:1",
      mechanical: {
        inputHP: 0.83,
        outputTorque: 370,
        outputSpeed: 117
      },
      efficiency: 83,
      ohl: 346,
      outputShaftThrustLoad: 69,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "20:1",
      mechanical: {
        inputHP: 0.63,
        outputTorque: 361,
        outputSpeed: 88
      },
      efficiency: 79,
      ohl: 381,
      outputShaftThrustLoad: 76,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "25:1",
      mechanical: {
        inputHP: 0.48,
        outputTorque: 328,
        outputSpeed: 70
      },
      efficiency: 76,
      ohl: 410,
      outputShaftThrustLoad: 82,
      backlash: {
        min: 10.8,
        max: 21.0
      }
    },
    {
      boxSize: 40,
      ratio: "30:1",
      mechanical: {
        inputHP: 0.53,
        outputTorque: 403,
        outputSpeed: 58
      },
      efficiency: 71,
      ohl: 436,
      outputShaftThrustLoad: 87,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "40:1",
      mechanical: {
        inputHP: 0.40,
        outputTorque: 378,
        outputSpeed: 44
      },
      efficiency: 66,
      ohl: 479,
      outputShaftThrustLoad: 96,
      backlash: {
        min: 11.4,
        max: 24.0
      }
    },
    {
      boxSize: 40,
      ratio: "50:1",
      mechanical: {
        inputHP: 0.31,
        outputTorque: 353,
        outputSpeed: 35
      },
      efficiency: 63,
      ohl: 517,
      outputShaftThrustLoad: 103,
      backlash: {
        min: 10.8,
        max: 21.0
      }
    },
    {
      boxSize: 40,
      ratio: "60:1",
      mechanical: {
        inputHP: 0.25,
        outputTorque: 319,
        outputSpeed: 29
      },
      efficiency: 59,
      ohl: 549,
      outputShaftThrustLoad: 110,
      backlash: {
        min: 11.4,
        max: 21.6
      }
    },
    {
      boxSize: 40,
      ratio: "80:1",
      mechanical: {
        inputHP: 0.18,
        outputTorque: 277,
        outputSpeed: 22
      },
      efficiency: 53,
      ohl: 604,
      outputShaftThrustLoad: 121,
      backlash: {
        min: 11.4,
        max: 21.6
      }
    },
    {
      boxSize: 40,
      ratio: "100:1",
      mechanical: {
        inputHP: 0.14,
        outputTorque: 244,
        outputSpeed: 18
      },
      efficiency: 48,
      ohl: 651,
      outputShaftThrustLoad: 130,
      backlash: {
        min: 11.4,
        max: 21.6
      }
    },
    // Box Size 50
    {
      boxSize: 50,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 2.72,
        outputTorque: 647,
        outputSpeed: 233
      },
      efficiency: 88,
      ohl: 377,
      outputShaftThrustLoad: 75,
      backlash: {
        min: 8.4,
        max: 19.2
      }
    },
    {
      boxSize: 50,
      ratio: "10:1",
      mechanical: {
        inputHP: 2.12,
        outputTorque: 664,
        outputSpeed: 175
      },
      efficiency: 87,
      ohl: 415,
      outputShaftThrustLoad: 83,
      backlash: {
        min: 8.4,
        max: 19.2
      }
    },
    {
      boxSize: 50,
      ratio: "15:1",
      mechanical: {
        inputHP: 1.52,
        outputTorque: 681,
        outputSpeed: 117
      },
      efficiency: 83,
      ohl: 475,
      outputShaftThrustLoad: 95,
      backlash: {
        min: 8.4,
        max: 19.2
      }
    },
    {
      boxSize: 50,
      ratio: "20:1",
      mechanical: {
        inputHP: 1.14,
        outputTorque: 656,
        outputSpeed: 88
      },
      efficiency: 80,
      ohl: 522,
      outputShaftThrustLoad: 104,
      backlash: {
        min: 6.6,
        max: 17.4
      }
    },
    {
      boxSize: 50,
      ratio: "25:1",
      mechanical: {
        inputHP: 0.86,
        outputTorque: 597,
        outputSpeed: 70
      },
      efficiency: 77,
      ohl: 563,
      outputShaftThrustLoad: 113,
      backlash: {
        min: 7.2,
        max: 17.4
      }
    },
    {
      boxSize: 50,
      ratio: "30:1",
      mechanical: {
        inputHP: 0.94,
        outputTorque: 740,
        outputSpeed: 58
      },
      efficiency: 73,
      ohl: 598,
      outputShaftThrustLoad: 120,
      backlash: {
        min: 8.4,
        max: 19.2
      }
    },
    {
      boxSize: 50,
      ratio: "40:1",
      mechanical: {
        inputHP: 0.70,
        outputTorque: 689,
        outputSpeed: 44
      },
      efficiency: 68,
      ohl: 658,
      outputShaftThrustLoad: 132,
      backlash: {
        min: 6.6,
        max: 17.4
      }
    },
    {
      boxSize: 50,
      ratio: "50:1",
      mechanical: {
        inputHP: 0.56,
        outputTorque: 647,
        outputSpeed: 35
      },
      efficiency: 64,
      ohl: 709,
      outputShaftThrustLoad: 142,
      backlash: {
        min: 7.2,
        max: 17.4
      }
    },
    {
      boxSize: 50,
      ratio: "60:1",
      mechanical: {
        inputHP: 0.47,
        outputTorque: 605,
        outputSpeed: 29
      },
      efficiency: 60,
      ohl: 753,
      outputShaftThrustLoad: 151,
      backlash: {
        min: 6.6,
        max: 16.2
      }
    },
    {
      boxSize: 50,
      ratio: "80:1",
      mechanical: {
        inputHP: 0.35,
        outputTorque: 546,
        outputSpeed: 22
      },
      efficiency: 54,
      ohl: 829,
      outputShaftThrustLoad: 166,
      backlash: {
        min: 6.6,
        max: 16.2
      }
    },
    {
      boxSize: 50,
      ratio: "100:1",
      mechanical: {
        inputHP: 0.26,
        outputTorque: 462,
        outputSpeed: 18
      },
      efficiency: 50,
      ohl: 893,
      outputShaftThrustLoad: 179,
      backlash: {
        min: 6.6,
        max: 16.2
      }
    },
    // Box Size 63
    {
      boxSize: 63,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 4.46,
        outputTorque: 1076,
        outputSpeed: 233
      },
      efficiency: 89,
      ohl: 492,
      outputShaftThrustLoad: 98,
      backlash: {
        min: 7.8,
        max: 17.4
      }
    },
    {
      boxSize: 63,
      ratio: "10:1",
      mechanical: {
        inputHP: 3.52,
        outputTorque: 1108,
        outputSpeed: 175
      },
      efficiency: 87,
      ohl: 542,
      outputShaftThrustLoad: 108,
      backlash: {
        min: 7.8,
        max: 17.4
      }
    },
    {
      boxSize: 63,
      ratio: "15:1",
      mechanical: {
        inputHP: 2.70,
        outputTorque: 1236,
        outputSpeed: 117
      },
      efficiency: 85,
      ohl: 620,
      outputShaftThrustLoad: 124,
      backlash: {
        min: 7.8,
        max: 17.4
      }
    },
    {
      boxSize: 63,
      ratio: "20:1",
      mechanical: {
        inputHP: 2.06,
        outputTorque: 1225,
        outputSpeed: 88
      },
      efficiency: 83,
      ohl: 683,
      outputShaftThrustLoad: 137,
      backlash: {
        min: 6.6,
        max: 16.2
      }
    },
    {
      boxSize: 63,
      ratio: "25:1",
      mechanical: {
        inputHP: 1.56,
        outputTorque: 1124,
        outputSpeed: 70
      },
      efficiency: 80,
      ohl: 736,
      outputShaftThrustLoad: 147,
      backlash: {
        min: 6.6,
        max: 13.8
      }
    },
    {
      boxSize: 63,
      ratio: "30:1",
      mechanical: {
        inputHP: 1.64,
        outputTorque: 1345,
        outputSpeed: 58
      },
      efficiency: 76,
      ohl: 782,
      outputShaftThrustLoad: 156,
      backlash: {
        min: 7.8,
        max: 17.4
      }
    },
    {
      boxSize: 63,
      ratio: "40:1",
      mechanical: {
        inputHP: 1.21,
        outputTorque: 1261,
        outputSpeed: 44
      },
      efficiency: 72,
      ohl: 860,
      outputShaftThrustLoad: 172,
      backlash: {
        min: 6.6,
        max: 16.2
      }
    },
    {
      boxSize: 63,
      ratio: "50:1",
      mechanical: {
        inputHP: 0.99,
        outputTorque: 1208,
        outputSpeed: 35
      },
      efficiency: 68,
      ohl: 927,
      outputShaftThrustLoad: 185,
      backlash: {
        min: 6.6,
        max: 13.8
      }
    },
    {
      boxSize: 63,
      ratio: "60:1",
      mechanical: {
        inputHP: 0.82,
        outputTorque: 1135,
        outputSpeed: 29
      },
      efficiency: 64,
      ohl: 985,
      outputShaftThrustLoad: 197,
      backlash: {
        min: 6.0,
        max: 13.8
      }
    },
    {
      boxSize: 63,
      ratio: "80:1",
      mechanical: {
        inputHP: 0.60,
        outputTorque: 1027,
        outputSpeed: 22
      },
      efficiency: 59,
      ohl: 1084,
      outputShaftThrustLoad: 217,
      backlash: {
        min: 6.0,
        max: 13.8
      }
    },
    {
      boxSize: 63,
      ratio: "100:1",
      mechanical: {
        inputHP: 0.51,
        outputTorque: 992,
        outputSpeed: 18
      },
      efficiency: 54,
      ohl: 1168,
      outputShaftThrustLoad: 234,
      backlash: {
        min: 6.0,
        max: 13.8
      }
    },
    // Box Size 75
    {
      boxSize: 75,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 6.44,
        outputTorque: 1555,
        outputSpeed: 233
      },
      efficiency: 89,
      ohl: 581,
      outputShaftThrustLoad: 116,
      backlash: {
        min: 7.8,
        max: 16.2
      }
    },
    {
      boxSize: 75,
      ratio: "10:1",
      mechanical: {
        inputHP: 5.20,
        outputTorque: 1656,
        outputSpeed: 175
      },
      efficiency: 88,
      ohl: 640,
      outputShaftThrustLoad: 128,
      backlash: {
        min: 7.8,
        max: 16.2
      }
    },
    {
      boxSize: 75,
      ratio: "15:1",
      mechanical: {
        inputHP: 4.07,
        outputTorque: 1900,
        outputSpeed: 117
      },
      efficiency: 86,
      ohl: 732,
      outputShaftThrustLoad: 146,
      backlash: {
        min: 7.8,
        max: 16.2
      }
    },
    {
      boxSize: 75,
      ratio: "20:1",
      mechanical: {
        inputHP: 3.24,
        outputTorque: 1953,
        outputSpeed: 88
      },
      efficiency: 84,
      ohl: 806,
      outputShaftThrustLoad: 161,
      backlash: {
        min: 6.6,
        max: 14.4
      }
    },
    {
      boxSize: 75,
      ratio: "25:1",
      mechanical: {
        inputHP: 2.43,
        outputTorque: 1784,
        outputSpeed: 70
      },
      efficiency: 82,
      ohl: 868,
      outputShaftThrustLoad: 174,
      backlash: {
        min: 6.6,
        max: 13.2
      }
    },
    {
      boxSize: 75,
      ratio: "30:1",
      mechanical: {
        inputHP: 2.41,
        outputTorque: 2028,
        outputSpeed: 58
      },
      efficiency: 78,
      ohl: 923,
      outputShaftThrustLoad: 185,
      backlash: {
        min: 7.8,
        max: 16.2
      }
    },
    {
      boxSize: 75,
      ratio: "40:1",
      mechanical: {
        inputHP: 1.90,
        outputTorque: 2029,
        outputSpeed: 44
      },
      efficiency: 74,
      ohl: 1015,
      outputShaftThrustLoad: 203,
      backlash: {
        min: 6.6,
        max: 14.4
      }
    },
    {
      boxSize: 75,
      ratio: "50:1",
      mechanical: {
        inputHP: 1.47,
        outputTorque: 1881,
        outputSpeed: 35
      },
      efficiency: 71,
      ohl: 1094,
      outputShaftThrustLoad: 219,
      backlash: {
        min: 6.6,
        max: 13.2
      }
    },
    {
      boxSize: 75,
      ratio: "60:1",
      mechanical: {
        inputHP: 1.22,
        outputTorque: 1778,
        outputSpeed: 29
      },
      efficiency: 67,
      ohl: 1162,
      outputShaftThrustLoad: 232,
      backlash: {
        min: 6.0,
        max: 12.6
      }
    },
    {
      boxSize: 75,
      ratio: "80:1",
      mechanical: {
        inputHP: 0.91,
        outputTorque: 1632,
        outputSpeed: 22
      },
      efficiency: 62,
      ohl: 1279,
      outputShaftThrustLoad: 256,
      backlash: {
        min: 6.0,
        max: 12.6
      }
    },
    {
      boxSize: 75,
      ratio: "100:1",
      mechanical: {
        inputHP: 0.74,
        outputTorque: 1517,
        outputSpeed: 18
      },
      efficiency: 57,
      ohl: 1378,
      outputShaftThrustLoad: 276,
      backlash: {
        min: 6.0,
        max: 12.6
      }
    },
    // Box Size 90
    {
      boxSize: 90,
      ratio: "7.5:1",
      mechanical: {
        inputHP: 10.98,
        outputTorque: 2682,
        outputSpeed: 233
      },
      efficiency: 90,
      ohl: 643,
      outputShaftThrustLoad: 129,
      backlash: {
        min: 7.2,
        max: 14.4
      }
    },
    {
      boxSize: 90,
      ratio: "10:1",
      mechanical: {
        inputHP: 8.92,
        outputTorque: 2867,
        outputSpeed: 175
      },
      efficiency: 89,
      ohl: 708,
      outputShaftThrustLoad: 142,
      backlash: {
        min: 7.2,
        max: 14.4
      }
    },
    {
      boxSize: 90,
      ratio: "15:1",
      mechanical: {
        inputHP: 7.05,
        outputTorque: 3330,
        outputSpeed: 117
      },
      efficiency: 87,
      ohl: 810,
      outputShaftThrustLoad: 162,
      backlash: {
        min: 7.2,
        max: 14.4
      }
    },
    {
      boxSize: 90,
      ratio: "20:1",
      mechanical: {
        inputHP: 5.33,
        outputTorque: 3288,
        outputSpeed: 88
      },
      efficiency: 86,
      ohl: 892,
      outputShaftThrustLoad: 178,
      backlash: {
        min: 6.6,
        max: 12.0
      }
    },
    {
      boxSize: 90,
      ratio: "25:1",
      mechanical: {
        inputHP: 4.18,
        outputTorque: 3145,
        outputSpeed: 70
      },
      efficiency: 84,
      ohl: 961,
      outputShaftThrustLoad: 192,
      backlash: {
        min: 6.0,
        max: 11.4
      }
    },
    {
      boxSize: 90,
      ratio: "30:1",
      mechanical: {
        inputHP: 4.21,
        outputTorque: 3632,
        outputSpeed: 58
      },
      efficiency: 80,
      ohl: 1021,
      outputShaftThrustLoad: 204,
      backlash: {
        min: 7.2,
        max: 14.4
      }
    },
    {
      boxSize: 90,
      ratio: "40:1",
      mechanical: {
        inputHP: 3.01,
        outputTorque: 3330,
        outputSpeed: 44
      },
      efficiency: 77,
      ohl: 1123,
      outputShaftThrustLoad: 225,
      backlash: {
        min: 6.6,
        max: 12.0
      }
    },
    {
      boxSize: 90,
      ratio: "50:1",
      mechanical: {
        inputHP: 2.36,
        outputTorque: 3145,
        outputSpeed: 35
      },
      efficiency: 74,
      ohl: 1210,
      outputShaftThrustLoad: 242,
      backlash: {
        min: 6.0,
        max: 11.4
      }
    },
    {
      boxSize: 90,
      ratio: "60:1",
      mechanical: {
        inputHP: 1.93,
        outputTorque: 2960,
        outputSpeed: 29
      },
      efficiency: 71,
      ohl: 1286,
      outputShaftThrustLoad: 257,
      backlash: {
        min: 5.4,
        max: 10.8
      }
    },
    {
      boxSize: 90,
      ratio: "80:1",
      mechanical: {
        inputHP: 1.27,
        outputTorque: 2397,
        outputSpeed: 22
      },
      efficiency: 65,
      ohl: 1416,
      outputShaftThrustLoad: 283,
      backlash: {
        min: 5.4,
        max: 10.8
      }
    },
    {
      boxSize: 90,
      ratio: "100:1",
      mechanical: {
        inputHP: 1.03,
        outputTorque: 2271,
        outputSpeed: 18
      },
      efficiency: 61,
      ohl: 1525,
      outputShaftThrustLoad: 305,
      backlash: {
        min: 5.4,
        max: 10.8
      }
    }
  ]
};
const helicalcatalog = {
  type: "Helical",
  data:[
    {
      "Box Size": 37,
      "Normal Ratio": 5.1,
      "Actual Ratio": 4.88,
      "Output RPM": 359,
      "Input HP": 5.91,
      "Output Torque (lbs.in)": 970,
      "O.H.L (lbs)": 305,
      "Stages": 2,
      "56C": {
        "HP": 1.0,
        "T": 165
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 330
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 5.1,
      "Actual Ratio": 4.88,
      "Output RPM": 359,
      "Input HP": 5.91,
      "Output Torque (lbs.in)": 970,
      "O.H.L (lbs)": 305,
      "Stages": 2,
      "56C": {
        "HP": 1.0,
        "T": 165
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 330
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 10.1,
      "Actual Ratio": 10.02,
      "Output RPM": 175,
      "Input HP": 4.04,
      "Output Torque (lbs.in)": 1360,
      "O.H.L (lbs)": 388,
      "Stages": 2,
      "56C": {
        "HP": 1.0,
        "T": 340
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 680
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 15.1,
      "Actual Ratio": 15.75,
      "Output RPM": 111,
      "Input HP": 2.99,
      "Output Torque (lbs.in)": 1580,
      "O.H.L (lbs)": 451,
      "Stages": 2,
      "56C": {
        "HP": 1.0,
        "T": 535
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 1070
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 20.1,
      "Actual Ratio": 19.95,
      "Output RPM": 88,
      "Input HP": 2.49,
      "Output Torque (lbs.in)": 1670,
      "O.H.L (lbs)": 489,
      "Stages": 2,
      "56C": {
        "HP": 1.0,
        "T": 680
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 1355
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 30.1,
      "Actual Ratio": 31.02,
      "Output RPM": 56,
      "Input HP": 1.75,
      "Output Torque (lbs.in)": 1770,
      "O.H.L (lbs)": 565,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 1025
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 2130
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 40.1,
      "Actual Ratio": 40.08,
      "Output RPM": 44,
      "Input HP": 1.35,
      "Output Torque (lbs.in)": 1770,
      "O.H.L (lbs)": 615,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 1325
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 50.1,
      "Actual Ratio": 52.24,
      "Output RPM": 33,
      "Input HP": 1.04,
      "Output Torque (lbs.in)": 1770,
      "O.H.L (lbs)": 670,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 1725
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 37,
      "Normal Ratio": 60.1,
      "Actual Ratio": 60.84,
      "Output RPM": 29,
      "Input HP": 0.89,
      "Output Torque (lbs.in)": 1770,
      "O.H.L (lbs)": 705,
      "Stages": 3,
      "56C": {
        "HP": 0.89,
        "T": 1770
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 5.1,
      "Actual Ratio": 4.85,
      "Output RPM": 361,
      "Input HP": 9.59,
      "Output Torque (lbs.in)": 1565,
      "O.H.L (lbs)": 440,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 330
      },
      "182TC": {
        "HP": 3.0,
        "T": 495
      },
      "184TC": {
        "HP": 5.0,
        "T": 825
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 10.1,
      "Actual Ratio": 11.27,
      "Output RPM": 155,
      "Input HP": 5.95,
      "Output Torque (lbs.in)": 2255,
      "O.H.L (lbs)": 590,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 1150
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 15.1,
      "Actual Ratio": 15.18,
      "Output RPM": 115,
      "Input HP": 4.87,
      "Output Torque (lbs.in)": 2490,
      "O.H.L (lbs)": 650,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 1555
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 20.1,
      "Actual Ratio": 18.37,
      "Output RPM": 95,
      "Input HP": 4.29,
      "Output Torque (lbs.in)": 2650,
      "O.H.L (lbs)": 690,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 1250
      },
      "182TC": {
        "HP": 3.0,
        "T": 1880
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 30.1,
      "Actual Ratio": 31.83,
      "Output RPM": 55,
      "Input HP": 2.73,
      "Output Torque (lbs.in)": 2830,
      "O.H.L (lbs)": 835,
      "Stages": 3,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 2105
      },
      "182TC": {
        "HP": 3.0,
        "T": 3250
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 40.1,
      "Actual Ratio": 41.51,
      "Output RPM": 42,
      "Input HP": 2.09,
      "Output Torque (lbs.in)": 2830,
      "O.H.L (lbs)": 910,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 1370
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 50.1,
      "Actual Ratio": 52.84,
      "Output RPM": 33,
      "Input HP": 1.64,
      "Output Torque (lbs.in)": 2830,
      "O.H.L (lbs)": 985,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 1740
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 47,
      "Normal Ratio": 60.1,
      "Actual Ratio": 63.37,
      "Output RPM": 28,
      "Input HP": 1.37,
      "Output Torque (lbs.in)": 2830,
      "O.H.L (lbs)": 1050,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 2095
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": "RX57",
      "Normal Ratio": 3.1,
      "Actual Ratio": 3.19,
      "Output RPM": 549,
      "Input HP": 4.04,
      "Output Torque (lbs.in)": 447,
      "O.H.L (lbs)": 133,
      "Stages": 1,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 336
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": "RX67",
      "Normal Ratio": 2.1,
      "Actual Ratio": 1.86,
      "Output RPM": 941,
      "Input HP": 9.43,
      "Output Torque (lbs.in)": 617,
      "O.H.L (lbs)": 43,
      "Stages": 1,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 196
      },
      "184TC": {
        "HP": 5.0,
        "T": 327
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": "RX67",
      "Normal Ratio": 2.5,
      "Actual Ratio": 2.35,
      "Output RPM": 745,
      "Input HP": 7.56,
      "Output Torque (lbs.in)": 616,
      "O.H.L (lbs)": 94,
      "Stages": 1,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 248
      },
      "184TC": {
        "HP": 5.0,
        "T": 413
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": "RX67",
      "Normal Ratio": 3.5,
      "Actual Ratio": 3.52,
      "Output RPM": 497,
      "Input HP": 4.11,
      "Output Torque (lbs.in)": 502,
      "O.H.L (lbs)": 301,
      "Stages": 1,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 371
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 5.1,
      "Actual Ratio": 5.23,
      "Output RPM": 335,
      "Input HP": 15.38,
      "Output Torque (lbs.in)": 2710,
      "O.H.L (lbs)": 710,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 355
      },
      "182TC": {
        "HP": 3.0,
        "T": 535
      },
      "184TC": {
        "HP": 5.0,
        "T": 890
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 10.1,
      "Actual Ratio": 9.90,
      "Output RPM": 177,
      "Input HP": 12.39,
      "Output Torque (lbs.in)": 4130,
      "O.H.L (lbs)": 880,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 1010
      },
      "184TC": {
        "HP": 5.0,
        "T": 1685
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 15.1,
      "Actual Ratio": 15.41,
      "Output RPM": 114,
      "Input HP": 9.23,
      "Output Torque (lbs.in)": 4785,
      "O.H.L (lbs)": 1020,
      "Stages": 2,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 1050
      },
      "182TC": {
        "HP": 3.0,
        "T": 1575
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 20.1,
      "Actual Ratio": 22.90,
      "Output RPM": 76,
      "Input HP": 6.87,
      "Output Torque (lbs.in)": 4720,
      "O.H.L (lbs)": 1165,
      "Stages": 3,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 2270
      },
      "184TC": {
        "HP": 5.0,
        "T": 3785
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 30.1,
      "Actual Ratio": 32.02,
      "Output RPM": 55,
      "Input HP": 4.83,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1305,
      "Stages": 3,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 2115
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 40.1,
      "Actual Ratio": 41.22,
      "Output RPM": 42,
      "Input HP": 3.75,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1420,
      "Stages": 3,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 2725
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 50.1,
      "Actual Ratio": 52.21,
      "Output RPM": 34,
      "Input HP": 2.96,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1480,
      "Stages": 3,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": 2.0,
        "T": 3400
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 60.1,
      "Actual Ratio": 63.07,
      "Output RPM": 28,
      "Input HP": 2.45,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1480,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 2085
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 80.1,
      "Actual Ratio": 78.59,
      "Output RPM": 22,
      "Input HP": 1.97,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1480,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 2590
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 100.1,
      "Actual Ratio": 98.69,
      "Output RPM": 18,
      "Input HP": 1.57,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1480,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 3260
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": 67,
      "Normal Ratio": 120.1,
      "Actual Ratio": 125.28,
      "Output RPM": 14,
      "Input HP": 1.23,
      "Output Torque (lbs.in)": 5045,
      "O.H.L (lbs)": 1480,
      "Stages": 3,
      "56C": {
        "HP": 1.0,
        "T": 4140
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": null,
        "T": null
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    {
      "Box Size": "RX77",
      "Normal Ratio": 4.1,
      "Actual Ratio": 4.19,
      "Output RPM": 418,
      "Input HP": 6.16,
      "Output Torque (lbs.in)": 895,
      "O.H.L (lbs)": 474,
      "Stages": 1,
      "56C": {
        "HP": null,
        "T": null
      },
      "143/145TC": {
        "HP": null,
        "T": null
      },
      "182TC": {
        "HP": 3.0,
        "T": 442
      },
      "184TC": {
        "HP": null,
        "T": null
      },
      "213TC": {
        "HP": null,
        "T": null
      },
      "215TC": {
        "HP": null,
        "T": null
      },
      "254TC": {
        "HP": null,
        "T": null
      },
      "256TC": {
        "HP": null,
        "T": null
      }
    },
    [
      {
        "Box Size": "77",
        "Normal Ratio": 5.1,
        "Actual Ratio": 4.78,
        "Output RPM": 366,
        "Input HP": 25.13,
        "Output Torque (lbs.in)": 4040,
        "O.H.L (lbs)": 785,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 485 },
        "184TC": { "HP": 5.0, "T": 815 },
        "213TC": { "HP": 7.5, "T": 1220 },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 10.1,
        "Actual Ratio": 10.91,
        "Output RPM": 160,
        "Input HP": 16.89,
        "Output Torque (lbs.in)": 6205,
        "O.H.L (lbs)": 1035,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": 7.5, "T": 2795 },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 15.1,
        "Actual Ratio": 14.83,
        "Output RPM": 118,
        "Input HP": 12.35,
        "Output Torque (lbs.in)": 6165,
        "O.H.L (lbs)": 1145,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 1515 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 20.1,
        "Actual Ratio": 23.31,
        "Output RPM": 75,
        "Input HP": 7.84,
        "Output Torque (lbs.in)": 6150,
        "O.H.L (lbs)": 1330,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 2385 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 25.1,
        "Actual Ratio": 25.27,
        "Output RPM": 69,
        "Input HP": 8.04,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1365,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 2515 },
        "184TC": { "HP": 5.0, "T": 4190 },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 30.1,
        "Actual Ratio": 31.97,
        "Output RPM": 55,
        "Input HP": 6.36,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1480,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 3155 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 40.1,
        "Actual Ratio": 39.31,
        "Output RPM": 45,
        "Input HP": 5.49,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1555,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 3855 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 50.1,
        "Actual Ratio": 53.24,
        "Output RPM": 33,
        "Input HP": 3.82,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1755,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 2.0, "T": 3505 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 60.1,
        "Actual Ratio": 57.73,
        "Output RPM": 30,
        "Input HP": 3.52,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1800,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 2.0, "T": 3855 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 80.1,
        "Actual Ratio": 84.62,
        "Output RPM": 21,
        "Input HP": 2.40,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1935,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 2.0, "T": 5510 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 100.1,
        "Actual Ratio": 89.80,
        "Output RPM": 19,
        "Input HP": 2.26,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1935,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 2.0, "T": 6090 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "77",
        "Normal Ratio": 120.1,
        "Actual Ratio": 124.34,
        "Output RPM": 14,
        "Input HP": 1.64,
        "Output Torque (lbs.in)": 6640,
        "O.H.L (lbs)": 1935,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 1.0, "T": 4130 },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 2.1,
        "Actual Ratio": 2.04,
        "Output RPM": 858,
        "Input HP": 26.27,
        "Output Torque (lbs.in)": 1859,
        "O.H.L (lbs)": 123,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 538 },
        "184TC": { "HP": 10.0, "T": 717 },
        "213TC": { "HP": 15.0, "T": 1075 },
        "215TC": { "HP": 20.0, "T": 1434 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 2.51,
        "Actual Ratio": 2.52,
        "Output RPM": 694,
        "Input HP": 20.25,
        "Output Torque (lbs.in)": 1770,
        "O.H.L (lbs)": 254,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 664 },
        "184TC": { "HP": 10.0, "T": 886 },
        "213TC": { "HP": 15.0, "T": 1328 },
        "215TC": { "HP": 20.0, "T": 1771 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 3.1,
        "Actual Ratio": 3.19,
        "Output RPM": 549,
        "Input HP": 14.4,
        "Output Torque (lbs.in)": 1593,
        "O.H.L (lbs)": 497,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 841 },
        "184TC": { "HP": 10.0, "T": 1121 },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 3.51,
        "Actual Ratio": 3.54,
        "Output RPM": 494,
        "Input HP": 12.83,
        "Output Torque (lbs.in)": 1575,
        "O.H.L (lbs)": 573,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 993 },
        "184TC": { "HP": 10.0, "T": 1244 },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 4.1,
        "Actual Ratio": 3.77,
        "Output RPM": 464,
        "Input HP": 11.51,
        "Output Torque (lbs.in)": 1505,
        "O.H.L (lbs)": 690,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 994 },
        "184TC": { "HP": 10.0, "T": 1325 },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX87",
        "Normal Ratio": 4.51,
        "Actual Ratio": 4.43,
        "Output RPM": 395,
        "Input HP": 6.91,
        "Output Torque (lbs.in)": 1062,
        "O.H.L (lbs)": 942,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 3.0, "T": 467 },
        "184TC": { "HP": 5.0, "T": 778 },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "87",
        "Normal Ratio": 5.1,
        "Actual Ratio": 4.73,
        "Output RPM": 370,
        "Input HP": 38.49,
        "Output Torque (lbs.in)": 6120,
        "O.H.L (lbs)": 1800,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 1205 },
        "184TC": { "HP": 10.0, "T": 1610 },
        "213TC": { "HP": 15.0, "T": 2415 },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "87",
        "Normal Ratio": 10.1,
        "Actual Ratio": 10.66,
        "Output RPM": 164,
        "Input HP": 27.28,
        "Output Torque (lbs.in)": 9790,
        "O.H.L (lbs)": 2375,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 2725 },
        "184TC": { "HP": 10.0, "T": 3635 },
        "213TC": { "HP": 15.0, "T": 3455 },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "87",
        "Normal Ratio": 15.1,
        "Actual Ratio": 15.29,
        "Output RPM": 114,
        "Input HP": 21.45,
        "Output Torque (lbs.in)": 11040,
        "O.H.L (lbs)": 2680,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 5.0, "T": 2615 },
        "184TC": { "HP": 7.5, "T": 3925 },
        "213TC": { "HP": 10.0, "T": 5230 },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX97",
        "Normal Ratio": 5.1,
        "Actual Ratio": 5.42,
        "Output RPM": 323,
        "Input HP": 68.89,
        "Output Torque (lbs.in)": 13010,
        "O.H.L (lbs)": 1980,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": 15, "T": 2770 },
        "215TC": { "HP": 20, "T": 3690 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "97",
        "Normal Ratio": 15.1,
        "Actual Ratio": 16.96,
        "Output RPM": 103,
        "Input HP": 39.04,
        "Output Torque (lbs.in)": 23055,
        "O.H.L (lbs)": 2900,
        "Stages": 2,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": 7.5, "T": 4340 },
        "184TC": { "HP": 10, "T": 5790 },
        "213TC": { "HP": 15, "T": 8685 },
        "215TC": { "HP": 20, "T": 11580 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "RX107",
        "Normal Ratio": 4.1,
        "Actual Ratio": 4.13,
        "Output RPM": 424,
        "Input HP": 32.13,
        "Output Torque (lbs.in)": 4602,
        "O.H.L (lbs)": 1205,
        "Stages": 1,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": 15, "T": 2177 },
        "215TC": { "HP": 20, "T": 2903 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "107",
        "Normal Ratio": 40.1,
        "Actual Ratio": 39.52,
        "Output RPM": 44,
        "Input HP": 25.5,
        "Output Torque (lbs.in)": 32667,
        "O.H.L (lbs)": 3951,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": 15, "T": 19600 },
        "215TC": { "HP": 20, "T": 26134 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "137",
        "Normal Ratio": 50.1,
        "Actual Ratio": 50.13,
        "Output RPM": 35,
        "Input HP": 32,
        "Output Torque (lbs.in)": 53076,
        "O.H.L (lbs)": 5545,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": 15, "T": 24734 },
        "215TC": { "HP": 20, "T": 33156 },
        "254TC": { "HP": null, "T": null },
        "256TC": { "HP": null, "T": null }
      },
      {
        "Box Size": "147",
        "Normal Ratio": 60.1,
        "Actual Ratio": 60.38,
        "Output RPM": 29,
        "Input HP": 42.3,
        "Output Torque (lbs.in)": 83306,
        "O.H.L (lbs)": 13090,
        "Stages": 3,
        "56C": { "HP": null, "T": null },
        "143/145TC": { "HP": null, "T": null },
        "182TC": { "HP": null, "T": null },
        "184TC": { "HP": null, "T": null },
        "213TC": { "HP": null, "T": null },
        "215TC": { "HP": null, "T": null },
        "254TC": { "HP": 20, "T": 39935 },
        "256TC": { "HP": null, "T": null }
      }
      
      
    ]
    
    
    






  ]
}




// Sample backend
const calculationHistory = [
    {
      _id: "6611f5cb1a1f5e123456abcd",
      motorPower: { value: 5.5, unit: "kW" },
      inputSpeed: 1450,
      desiredOutputSpeed: 72,
      gearRatio: "20.1:1",
      torque: "1300 Nm",
      conditions: {
        loadType: "Medium",
        dailyOperationHours: "4-8h",
        environment: ["Dusty", "High Temperature"]
      },
      selectedGearboxType: "Helical",
      recommendations: [
        "6611fabc12345678deadbeef", 
        "6611fa9e98765432aabbccdd"
      ],
      createdAt: "2025-04-06T15:43:22.000Z"
    },
    {
      _id: "6611f5cb1a1f5e9876543210",
      motorPower: { value: 3.0, unit: "HP" },
      inputSpeed: 1750,
      desiredOutputSpeed: 250,
      gearRatio: "7:1",
      torque: "600 Nm",
      conditions: {
        loadType: "Light",
        dailyOperationHours: "<4h",
        environment: ["Normal"]
      },
      selectedGearboxType: "Worm",
      recommendations: [
        "6611fabc99999999bbbbcccc"
      ],
      createdAt: "2025-04-06T16:00:00.000Z"
    }
  ];
  
fs.writeFileSync('Authentication.json', JSON.stringify(data_authen, null, 2), 'utf-8');
console.log("Đã tạo file json Auth thành công!");
fs.writeFileSync('catalog_worm.json', JSON.stringify(wormcatalog, null, 2), 'utf-8');
console.log("Đã tạo file json catalog_worm thành công!");
fs.writeFileSync('catalog_Heli.json', JSON.stringify(helicalcatalog , null, 2), 'utf-8');
//console.log("Đã tạo file json catalog_Heli thành công!");
fs.writeFileSync('calculationHistory.json', JSON.stringify(calculationHistory, null, 2), 'utf-8');
console.log("Đã tạo file json calculationHistory thành công!");

