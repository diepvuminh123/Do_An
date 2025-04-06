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
const data_catalog = [
    {
        "inputSpeed": "1750 RPM",
        "Worm_Gear": [
          {
            "boxSize": 133,
            "loadCapacity": {
              "outputShaftThrust": 300,
              "ohlValue": 300
            },
            "backlash": 27,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 1.15
                  },
                  "output": {
                    "torque": 209,
                    "hp": 1.05
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 1.21
                  },
                  "output": {
                    "torque": 221,
                    "hp": 1.11
                  }
                },
                "efficiency": 91
              },
              {
                "ratio": "10:1",
                "ratioValue": 10.1,
                "mechanical": {
                  "input": {
                    "hp": 0.77
                  },
                  "output": {
                    "torque": 247,
                    "hp": 0.66
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.75
                  },
                  "output": {
                    "torque": 240,
                    "hp": 0.64
                  }
                },
                "efficiency": 86
              },
              {
                "ratio": "15:1",
                "ratioValue": 15.1,
                "mechanical": {
                  "input": {
                    "hp": 0.63
                  },
                  "output": {
                    "torque": 283,
                    "hp": 0.5
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.53
                  },
                  "output": {
                    "torque": 238,
                    "hp": 0.42
                  }
                },
                "efficiency": 80
              },
              {
                "ratio": "20:1",
                "ratioValue": 20.1,
                "mechanical": {
                  "input": {
                    "hp": 0.5
                  },
                  "output": {
                    "torque": 276,
                    "hp": 0.39
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.48
                  },
                  "output": {
                    "torque": 266,
                    "hp": 0.38
                  }
                },
                "efficiency": 78
              },
              {
                "ratio": "30:1",
                "ratioValue": 30.1,
                "mechanical": {
                  "input": {
                    "hp": 0.47
                  },
                  "output": {
                    "torque": 336,
                    "hp": 0.31
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.31
                  },
                  "output": {
                    "torque": 221,
                    "hp": 0.20
                  }
                },
                "efficiency": 66
              },
              {
                "ratio": "40:1",
                "ratioValue": 40.1,
                "mechanical": {
                  "input": {
                    "hp": 0.38
                  },
                  "output": {
                    "torque": 356,
                    "hp": 0.25
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.30
                  },
                  "output": {
                    "torque": 282,
                    "hp": 0.19
                  }
                },
                "efficiency": 65
              },
              {
                "ratio": "50:1",
                "ratioValue": 50.1,
                "mechanical": {
                  "input": {
                    "hp": 0.29
                  },
                  "output": {
                    "torque": 312,
                    "hp": 0.17
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.26
                  },
                  "output": {
                    "torque": 282,
                    "hp": 0.15
                  }
                },
                "efficiency": 59
              },
              {
                "ratio": "60:1",
                "ratioValue": 60.1,
                "mechanical": {
                  "input": {
                    "hp": 0.23
                  },
                  "output": {
                    "torque": 261,
                    "hp": 0.12
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.22
                  },
                  "output": {
                    "torque": 252,
                    "hp": 0.12
                  }
                },
                "efficiency": 53
              }
            ]
          },
          {
            "boxSize": 154,
            "loadCapacity": {
              "outputShaftThrust": 400,
              "ohlValue": 450
            },
            "backlash": 23,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 2.06
                  },
                  "output": {
                    "torque": 345,
                    "hp": 1.90
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 2.04
                  },
                  "output": {
                    "torque": 341,
                    "hp": 1.88
                  }
                },
                "efficiency": 92
              },
              {
                "ratio": "10:1",
                "ratioValue": 10.1,
                "mechanical": {
                  "input": {
                    "hp": 1.29
                  },
                  "output": {
                    "torque": 411,
                    "hp": 1.13
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 1.03
                  },
                  "output": {
                    "torque": 327,
                    "hp": 0.9
                  }
                },
                "efficiency": 88
              },
              {
                "ratio": "15:1",
                "ratioValue": 15.1,
                "mechanical": {
                  "input": {
                    "hp": 1.11
                  },
                  "output": {
                    "torque": 518,
                    "hp": 0.96
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.78
                  },
                  "output": {
                    "torque": 363,
                    "hp": 0.67
                  }
                },
                "efficiency": 86
              },
              {
                "ratio": "20:1",
                "ratioValue": 20.1,
                "mechanical": {
                  "input": {
                    "hp": 0.86
                  },
                  "output": {
                    "torque": 509,
                    "hp": 0.70
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.65
                  },
                  "output": {
                    "torque": 384,
                    "hp": 0.53
                  }
                },
                "efficiency": 81
              },
              {
                "ratio": "30:1",
                "ratioValue": 30.1,
                "mechanical": {
                  "input": {
                    "hp": 0.62
                  },
                  "output": {
                    "torque": 504,
                    "hp": 0.46
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.48
                  },
                  "output": {
                    "torque": 388,
                    "hp": 0.36
                  }
                },
                "efficiency": 74
              },
              {
                "ratio": "40:1",
                "ratioValue": 40.1,
                "mechanical": {
                  "input": {
                    "hp": 0.51
                  },
                  "output": {
                    "torque": 503,
                    "hp": 0.35
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.4
                  },
                  "output": {
                    "torque": 397,
                    "hp": 0.27
                  }
                },
                "efficiency": 68
              },
              {
                "ratio": "50:1",
                "ratioValue": 50.1,
                "mechanical": {
                  "input": {
                    "hp": 0.47
                  },
                  "output": {
                    "torque": 565,
                    "hp": 0.31
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.34
                  },
                  "output": {
                    "torque": 407,
                    "hp": 0.22
                  }
                },
                "efficiency": 66
              },
              {
                "ratio": "60:1",
                "ratioValue": 60.1,
                "mechanical": {
                  "input": {
                    "hp": 0.39
                  },
                  "output": {
                    "torque": 502,
                    "hp": 0.23
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 0.29
                  },
                  "output": {
                    "torque": 373,
                    "hp": 0.17
                  }
                },
                "efficiency": 59
              }
            ]
          },
          {
            "boxSize": 175,
            "loadCapacity": {
              "outputShaftThrust": 550,
              "ohlValue": 650
            },
            "backlash": 20,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 2.83
                  },
                  "output": {
                    "torque": 499,
                    "hp": 2.62
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 2.28
                  },
                  "output": {
                    "torque": 402,
                    "hp": 2.11
                  }
                },
                "efficiency": 93
              }
            ]
          },
          {
            "boxSize": 206,
            "loadCapacity": {
              "outputShaftThrust": 750,
              "ohlValue": 700
            },
            "backlash": 17,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 3.62
                  },
                  "output": {
                    "torque": 685,
                    "hp": 3.33
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 2.57
                  },
                  "output": {
                    "torque": 486,
                    "hp": 2.36
                  }
                },
                "efficiency": 92
              }
            ]
          },
          {
            "boxSize": 237,
            "loadCapacity": {
              "outputShaftThrust": 900,
              "ohlValue": 900
            },
            "backlash": 17,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 4.57
                  },
                  "output": {
                    "torque": 798,
                    "hp": 4.02
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 3.56
                  },
                  "output": {
                    "torque": 630,
                    "hp": 3.31
                  }
                },
                "efficiency": 93
              }
            ]
          },
          {
            "boxSize": 262,
            "loadCapacity": {
              "outputShaftThrust": 1000,
              "ohlValue": 1000
            },
            "backlash": 17,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 5.24
                  },
                  "output": {
                    "torque": 924,
                    "hp": 4.82
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 4.32
                  },
                  "output": {
                    "torque": 761,
                    "hp": 4.00
                  }
                },
                "efficiency": 93
              }
            ]
          },
          {
            "boxSize": 325,
            "loadCapacity": {
              "outputShaftThrust": 1100,
              "ohlValue": 1200
            },
            "backlash": 15,
            "ratios": [
              {
                "ratio": "5:1",
                "ratioValue": 5.1,
                "mechanical": {
                  "input": {
                    "hp": 9.72
                  },
                  "output": {
                    "torque": 1724,
                    "hp": 9.06
                  }
                },
                "thermal": {
                  "input": {
                    "hp": 6.93
                  },
                  "output": {
                    "torque": 1228,
                    "hp": 6.46
                  }
                },
                "efficiency": 93
              }
            ]
          }
        ]
      }

];
//helical
const data_catalog2=[
    {
        "gearboxSpecifications": {
          "Helical": [
            {
              "size": 37,
              "configurations": [
                {
                  "normalRatio": "5:1",
                  "actualRatio": 4.85,
                  "outputRPM": 359,
                  "inputHP": 5.91,
                  "outputTorque": {
                    "value": 970,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 305,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 1,
                  "thermalRatings": {
                    "56C": {
                      "hp": 1.0,
                      "torque": null
                    },
                    "143TC/145TC": {
                      "hp": 2.0,
                      "torque": 2.0
                    },
                    "182TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "184TC": {
                      "hp": 3.0,
                      "torque": null
                    },
                    "213TC": {
                      "hp": null,
                      "torque": null
                    },
                    "215TC": {
                      "hp": null,
                      "torque": null
                    },
                    "254TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": null,
                      "torque": null
                    }
                  }
                },
                {
                  "normalRatio": "10:1",
                  "actualRatio": 10.02,
                  "outputRPM": 175,
                  "inputHP": 4.04,
                  "outputTorque": {
                    "value": 1360,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 388,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 1,
                  "thermalRatings": {
                    "56C": {
                      "hp": 1.0,
                      "torque": null
                    },
                    "143TC/145TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "182TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "184TC": {
                      "hp": null,
                      "torque": null
                    },
                    "213TC": {
                      "hp": null,
                      "torque": null
                    },
                    "215TC": {
                      "hp": null,
                      "torque": null
                    },
                    "254TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": null,
                      "torque": null
                    }
                  }
                },
                {
                  "normalRatio": "20:1",
                  "actualRatio": 19.95,
                  "outputRPM": 88,
                  "inputHP": 2.49,
                  "outputTorque": {
                    "value": 1670,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 489,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 2,
                  "thermalRatings": {
                    "56C": {
                      "hp": 1.0,
                      "torque": null
                    },
                    "143TC/145TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "182TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "184TC": {
                      "hp": null,
                      "torque": null
                    },
                    "213TC": {
                      "hp": null,
                      "torque": null
                    },
                    "215TC": {
                      "hp": null,
                      "torque": null
                    },
                    "254TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": null,
                      "torque": null
                    }
                  }
                },
                {
                  "normalRatio": "30:1",
                  "actualRatio": 31.02,
                  "outputRPM": 56,
                  "inputHP": 1.75,
                  "outputTorque": {
                    "value": 1770,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 565,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 2,
                  "thermalRatings": {
                    "56C": {
                      "hp": 1.0,
                      "torque": null
                    },
                    "143TC/145TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "182TC": {
                      "hp": 2.0,
                      "torque": null
                    },
                    "184TC": {
                      "hp": null,
                      "torque": null
                    },
                    "213TC": {
                      "hp": null,
                      "torque": null
                    },
                    "215TC": {
                      "hp": null,
                      "torque": null
                    },
                    "254TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": null,
                      "torque": null
                    }
                  }
                }
              ]
            },
            {
              "size": 47,
              "configurations": [
                {
                  "normalRatio": "5:1",
                  "actualRatio": 4.85,
                  "outputRPM": 359,
                  "inputHP": 9.59,
                  "outputTorque": {
                    "value": 1585,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 440,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 1,
                  "thermalRatings": {
                    "56C": {
                      "hp": null,
                      "torque": null
                    },
                    "143TC/145TC": {
                      "hp": 2.0,
                      "torque": 2.0
                    },
                    "182TC": {
                      "hp": 3.0,
                      "torque": 3.0
                    },
                    "184TC": {
                      "hp": 4.95,
                      "torque": 5.0
                    },
                    "213TC": {
                      "hp": 8.25,
                      "torque": null
                    }
                  }
                },
                {
                  "normalRatio": "10:1",
                  "actualRatio": 10.27,
                  "outputRPM": 155,
                  "inputHP": 5.99,
                  "outputTorque": {
                    "value": 2245,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 630,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 1,
                  "thermalRatings": {
                    "143TC/145TC": {
                      "hp": null,
                      "torque": 3.0
                    },
                    "182TC": {
                      "hp": 11.59,
                      "torque": 3.0
                    }
                  }
                }
              ]
            },
            {
              "size": 97,
              "configurations": [
                {
                  "normalRatio": "2:1",
                  "actualRatio": 2.12,
                  "outputRPM": 825,
                  "inputHP": 51.93,
                  "outputTorque": {
                    "value": 3819,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 152,
                    "unit": "lbs."
                  },
                  "ohl": 1,
                  "stages": 1,
                  "thermalRatings": {
                    "254TC": {
                      "hp": 25,
                      "torque": 25
                    },
                    "284TC": {
                      "hp": 1963,
                      "torque": 30
                    },
                    "286TC": {
                      "hp": 2235,
                      "torque": 30
                    },
                    "324TC": {
                      "hp": null,
                      "torque": null
                    },
                    "326TC": {
                      "hp": null,
                      "torque": null
                    },
                    "364TC": {
                      "hp": null,
                      "torque": null
                    },
                    "365TC": {
                      "hp": null,
                      "torque": null
                    },
                    "405TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": null,
                      "torque": 15
                    },
                    "254TC": {
                      "hp": 1618,
                      "torque": 20
                    },
                    "256TC": {
                      "hp": 2158,
                      "torque": 20
                    }
                  }
                },
                {
                  "normalRatio": "5:1",
                  "actualRatio": 5.42,
                  "outputRPM": 323,
                  "inputHP": 68.89,
                  "outputTorque": {
                    "value": 13010,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 1980,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 2,
                  "thermalRatings": {
                    "254TC": {
                      "hp": 25,
                      "torque": 25
                    },
                    "284TC": {
                      "hp": 4615,
                      "torque": 30
                    },
                    "286TC": {
                      "hp": 5540,
                      "torque": 30
                    }
                  }
                }
              ]
            },
            {
              "size": 147,
              "configurations": [
                {
                  "normalRatio": "5:1",
                  "actualRatio": 5.00,
                  "outputRPM": 350,
                  "inputHP": 342,
                  "outputTorque": {
                    "value": 57285,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 5700,
                    "unit": "lbs."
                  },
                  "ohl": 2,
                  "stages": 2,
                  "thermalRatings": {
                    "254TC": {
                      "hp": 25,
                      "torque": 25
                    },
                    "284TC": {
                      "hp": 4621,
                      "torque": 30
                    },
                    "286TC": {
                      "hp": 5113,
                      "torque": 30
                    },
                    "324TC": {
                      "hp": 40,
                      "torque": 40
                    },
                    "326TC": {
                      "hp": 6818,
                      "torque": 50
                    },
                    "364TC": {
                      "hp": 8522,
                      "torque": 60
                    },
                    "365TC": {
                      "hp": 10227,
                      "torque": 75
                    },
                    "405TC": {
                      "hp": 12784,
                      "torque": 100
                    },
                    "405TC": {
                      "hp": 17045,
                      "torque": 100
                    }
                  }
                },
                {
                  "normalRatio": "120:1",
                  "actualRatio": 117.29,
                  "outputRPM": 15,
                  "inputHP": 21,
                  "outputTorque": {
                    "value": 83300,
                    "unit": "lbs.in."
                  },
                  "outputTorqueOverhung": {
                    "value": 13640,
                    "unit": "lbs."
                  },
                  "ohl": 3,
                  "stages": 3,
                  "thermalRatings": {
                    "254TC": {
                      "hp": null,
                      "torque": null
                    },
                    "256TC": {
                      "hp": 72567,
                      "torque": 20
                    }
                  }
                }
              ]
            }
          ]
        }
      }

];
const merged_catalog = {
    Worm_Gear: data_catalog,
    Helical_Gear: data_catalog2
  };
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
fs.writeFileSync('catalog.json', JSON.stringify(merged_catalog, null, 2), 'utf-8');
console.log("Đã tạo file json catalog thành công!");
fs.writeFileSync('calculationHistory.json', JSON.stringify(calculationHistory, null, 2), 'utf-8');
console.log("Đã tạo file json calculationHistory thành công!");

