import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Interface for gearbox items from the database
interface GearboxItem {
  motorType: string;
  outputSpeedRpm: string;
  ratio: string;
  outputTorqueNm: string;
  serviceFactor: string;
  overhungLoad: string;
  unitDesignation: string;
  baseUnitWeightKg: string;
  motorSize: string;
  matchScore?: number; // Added for ranking purposes
  compatibilityStatus?: 'excellent' | 'good' | 'acceptable' | 'marginal';
}

// Helper function to parse the comma decimal format used in the data
const parseDecimal = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
};

// Function to find matching gearboxes
const findMatchingGearboxes = (
  gearboxes: GearboxItem[],
  requiredPower: number,
  torque: number,
  rotationSpeed: number,
  totalRatio: number
): GearboxItem[] => {
  // Extract the power value from strings like "7,5kW"
  const getPowerValue = (motorType: string): number => {
    return parseFloat(motorType.replace(',', '.').replace('kW', ''));
  };

  // Calculate match score for each gearbox (lower is better)
  const scoredGearboxes = gearboxes.map(gearbox => {
    const powerValue = getPowerValue(gearbox.motorType);
    const outputSpeed = parseDecimal(gearbox.outputSpeedRpm);
    const ratio = parseDecimal(gearbox.ratio);
    const outputTorque = parseDecimal(gearbox.outputTorqueNm);
    
    // Convert torque from N.mm to Nm for comparison
    const requiredTorqueNm = torque / 1000;
    
    // Calculate normalized percentage differences
    const powerDiff = Math.abs(powerValue - requiredPower) / requiredPower;
    const speedDiff = Math.abs(outputSpeed - rotationSpeed) / rotationSpeed;
    const ratioDiff = Math.abs(ratio - totalRatio) / totalRatio;
    const torqueDiff = Math.abs(outputTorque - requiredTorqueNm) / requiredTorqueNm;
    
    // Weighted score - give more importance to ratio and speed
    // Also, penalize gearboxes with insufficient power or torque
    const powerPenalty = powerValue < requiredPower ? 5 : 0;
    const torquePenalty = outputTorque < requiredTorqueNm ? 5 : 0;
    
    const score = 
      (powerDiff * 0.25) + 
      (speedDiff * 0.3) + 
      (ratioDiff * 0.3) + 
      (torqueDiff * 0.15) +
      powerPenalty +
      torquePenalty;
    
    // Determine compatibility status
    let compatibilityStatus: 'excellent' | 'good' | 'acceptable' | 'marginal' = 'marginal';
    if (score < 0.2 && powerValue >= requiredPower && outputTorque >= requiredTorqueNm) {
      compatibilityStatus = 'excellent';
    } else if (score < 0.4 && powerValue >= requiredPower) {
      compatibilityStatus = 'good';
    } else if (score < 0.7) {
      compatibilityStatus = 'acceptable';
    }
    
    return {
      ...gearbox,
      matchScore: score,
      compatibilityStatus
    };
  });
  
  // Sort by score (lower is better) and return top matches
  return scoredGearboxes
    .sort((a, b) => (a.matchScore || 999) - (b.matchScore || 999))
    .slice(0, 10); // Top 10 matches
};

// Mock image assets - in a real app, you would add actual image files
const mockAssets = {
  gearbox: require('../../assets/images/Gearbox.png'),
};

export default function GearboxRecommendationsScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [gearboxData, setGearboxData] = useState<GearboxItem[]>([]);
  const [selectedGearbox, setSelectedGearbox] = useState<GearboxItem | null>(null);
  const [matchingGearboxes, setMatchingGearboxes] = useState<GearboxItem[]>([]);
  
  // Convert parameters to numbers
  const requiredPower = parseFloat(params.requiredPower as string) || 6.141;
  const torque = parseFloat(params.torque as string) || 2062866.01;
  const rotationSpeed = parseFloat(params.rotationSpeed as string) || 31.252;
  const totalRatio = parseFloat(params.totalRatio as string) || 46.4;
  
  useEffect(() => {
    const fetchGearboxData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would fetch from a database or API
        // For now, we'll simulate fetching the data
        setTimeout(() => {
          // Parse the tab-separated data from the text file
          // This would normally be read from a file or API
          const rawData = loadGearboxDataFromTextFile();
          const parsedData = parseGearboxData(rawData);
          
          setGearboxData(parsedData);
          
          // Find matching gearboxes
          const matches = findMatchingGearboxes(
            parsedData,
            requiredPower,
            torque,
            rotationSpeed,
            totalRatio
          );
          
          setMatchingGearboxes(matches);
          
          // Select the first match by default
          if (matches.length > 0) {
            setSelectedGearbox(matches[0]);
          }
          
          setLoading(false);
        }, 1500); // Simulate loading time
      } catch (error) {
        console.error('Error loading gearbox data:', error);
        setLoading(false);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu hộp giảm tốc. Vui lòng thử lại sau.');
      }
    };
    
    fetchGearboxData();
  }, [requiredPower, torque, rotationSpeed, totalRatio]);
  
  // Function to parse the gearbox data
  const parseGearboxData = (data: string): GearboxItem[] => {
    return data
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split('\t');
        return {
          motorType: parts[0]?.trim() || '',
          outputSpeedRpm: parts[1]?.trim() || '',
          ratio: parts[2]?.trim() || '',
          outputTorqueNm: parts[3]?.trim() || '',
          serviceFactor: parts[4]?.trim() || '',
          overhungLoad: parts[5]?.trim() || '',
          unitDesignation: parts[6]?.trim() || '',
          baseUnitWeightKg: parts[7]?.trim() || '',
          motorSize: parts[8]?.trim() || '',
        };
      });
  };
  
  // This would normally load data from a file or API
  // Here we'll include the first few entries of the data for demo purposes
  const loadGearboxDataFromTextFile = (): string => {
    return `7,5kW 	405	3,58	173	1,17	4803	R04223.6_M_-__7.5A--	99	132M
7,5kW 	405	3,58	173	1,37	5010	R04225.0_M_-__7.5A--	99	132M
7,5kW 	405	3,58	173	1,44	5099	R04225.6_M_-__7.5A--	99	132M
7,5kW 	405	3,58	173	1,51	5233	R04226.3_M_-__7.5A--	99	132M
7,5kW 	405	3,58	173	1,68	4037	R05223.6_M_-__7.5A--	99	132M
7,5kW 	288	5,04	244	1,57	4223	R05225.0_M_-__7.5A--	99	132M
7,5kW 	257	5,65	274	1,5	4317	R05225.6_M_-__7.5A--	99	132M
7,5kW 	229	6,34	307	1,35	4391	R05226.3_M_-__7.5A--	99	132M
7,5kW 	327	4,44	215	1,68	7200	R06225.0_M_-__7.5A--	104	132M
7,5kW 	232	6,24	302	1,57	7200	R06225.6_M_-__7.5A--	104	132M
7,5kW 	207	6,99	338	1,51	7200	R06226.3_M_-__7.5A--	104	132M
7,5kW 	185	7,85	380	1,35	7200	R06228.0_M_-__7.5A--	104	132M
7,5kW 	145	9,97	483	1,23	7200	R06229.0_M_-__7.5A--	104	132M
7,5kW 	128	11,3	547	1,1	7200	R062211._M_-__7.5A--	104	132M
7,5kW 	394	3,68	178	1,74	8418	R07223.6_M_-__7.5A--	113	132M
7,5kW 	285	5,09	246	1,74	7599	R07225.0_M_-__7.5A--	113	132M
7,5kW 	253	5,72	277	1,74	7415	R07225.6_M_-__7.5A--	113	132M
7,5kW 	231	6,29	304	1,74	6260	R07226.3_M_-__7.5A--	113	132M
7,5kW 	176	8,22	398	1,65	5303	R07228.0_M_-__7.5A--	113	132M
7,5kW 	155	9,34	452	1,52	5478	R07229.0_M_-__7.5A--	113	132M
7,5kW 	128	11,35	549	1,32	5723	R072211._M_-__7.5A--	113	132M
7,5kW 	116	12,48	604	1,23	5852	R072212._M_-__7.5A--	113	132M
7,5kW 	101	14,34	694	1,1	6031	R072214._M_-__7.5A--	113	132M
7,5kW 	89	16,26	787	1,01	6337	R072216._M_-__7.5A--	113	132M
7,5kW 	81	17,94	868	0,92	6659	R072218._M_-__7.5A--	113	132M
7,5kW 	71	20,54	994	0,82	7142	R072220._M_-__7.5A--	113	132M
7,5kW 	394	3,68	178	2,72	14178	R08223.6_M_-__7.5A--	146	132M
7,5kW 	278	5,21	252	2,72	13997	R08225.0_M_-__7.5A--	146	132M
7,5kW 	250	5,79	280	2,72	12728	R08225.6_M_-__7.5A--	146	132M
7,5kW 	225	6,44	312	2,72	11612	R08226.3_M_-__7.5A--	146	132M
7,5kW 	174	8,33	403	2,72	8886	R08228.0_M_-__7.5A--	146	132M
7,5kW 	155	9,35	453	2,71	7276	R08229.0_M_-__7.5A--	146	132M
7,5kW 	126	11,47	555	2,38	7261	R082211._M_-__7.5A--	146	132M
7,5kW 	112	12,92	625	2,17	7514	R082212._M_-__7.5A--	146	132M
7,5kW 	96	15,04	728	1,95	7426	R082214._M_-__7.5A--	146	132M
7,5kW 	87	16,69	808	1,78	7725	R082216._M_-__7.5A--	146	132M
7,5kW 	79	18,26	884	1,55	8395	R082218._M_-__7.5A--	146	132M
7,5kW 	70	20,66	1000	1,47	8868	R082220._M_-__7.5A--	146	132M
7,5kW 	62	23,32	1129	1,37	9317	R082222._M_-__7.5A--	146	132M
7,5kW 	51	28,27	1369	1,18	10034	R082228._M_-__7.5A--	146	132M
7,5kW 	44	32,97	1596	1,03	10100	R082232._M_-__7.5A--	146	132M
7,5kW 	40	36,21	1753	0,95	10441	R082236._M_-__7.5A--	146	132M
7,5kW 	89	16,34	791	3,1	12343	R092216._M_-__7.5A--	194	132M
7,5kW 	78	18,5	896	2,81	12438	R092218._M_-__7.5A--	194	132M
7,5kW 	70	20,59	997	2,61	12335	R092220._M_-__7.5A--	194	132M
7,5kW 	63	22,87	1107	2,43	12459	R092222._M_-__7.5A--	194	132M
7,5kW 	52	27,98	1354	2,12	13250	R092228._M_-__7.5A--	194	132M
7,5kW 	45	32,31	1564	1,88	14470	R092232._M_-__7.5A--	194	132M
7,5kW 	41	35,67	1727	1,72	15604	R092236._M_-__7.5A--	194	132M
7,5kW 	33	43,35	2099	1,46	17512	R092245._M_-__7.5A--	194	132M
7,5kW 	30	49,07	2375	1,2	20500	R092250._M_-__7.5A--	194	132M
7,5kW 	26	55,18	2671	0,99	20500	R092256._M_-__7.5A--	194	132M
7,5kW 	25	59,07	2830	1,1	20500	R093256._M_-__7.5A--	209	132M
7,5kW 	22	64,64	3097	1	20500	R093263._M_-__7.5A--	209	132M
7,5kW 	20	73,13	3504	0,89	20500	R093271._M_-__7.5A--	209	132M
7,5kW 	57	25,49	1234	3,81	15176	R102228._M_-__7.5A--	223	132M
7,5kW 	47	30,76	1489	3,36	15653	R102232._M_-__7.5A--	223	132M
7,5kW 	41	35,44	1716	2,91	18898	R102236._M_-__7.5A--	223	132M
7,5kW 	35	41,12	1991	2,51	22243	R102245._M_-__7.5A--	223	132M
7,5kW 	30	47,93	2320	1,84	30000	R102250._M_-__7.5A--	223	132M
7,5kW 	28	51,49	2493	1,55	30000	R102256._M_-__7.5A--	223	132M
7,5kW 	25	57,63	2761	1,73	30000	R103256._M_-__7.5A--	246	132M
7,5kW 	22	65,24	3126	1,53	30000	R103263._M_-__7.5A--	246	132M
7,5kW 	20	72,62	3480	1,37	30000	R103271._M_-__7.5A--	246	132M
7,5kW 	18	80,68	3866	1,24	30000	R103280._M_-__7.5A--	246	132M
7,5kW 	15	98,68	4728	1,01	30000	R1032100_M_-__7.5A--	246	132M
7,5kW 	13	113,96	5460	0,88	30000	R1032112_M_-__7.5A--	246	132M
7,5kW 	34	43,25	2094	3,69	55000	R132245._M_-__7.5A--	304	132M
7,5kW 	29	50,7	2454	2,41	55000	R132250._M_-__7.5A--	304	132M
7,5kW 	27	53,94	2611	2,41	55000	R132256._M_-__7.5A--	304	132M
7,5kW 	24	59,76	2863	3,22	55000	R133256._M_-__7.5A--	343	132M
11,0kW	397	3,68	259	1,18	8065	R07223.6_M_-__11.A--	176	160M
11,0kW	287	5,09	359	1,18	7284	R07225.0_M_-__11.A--	176	160M
11,0kW	255	5,72	403	1,18	6900	R07225.6_M_-__11.A--	176	160M
11,0kW	232	6,29	444	1,18	6570	R07226.3_M_-__11.A--	176	160M
11,0kW	178	8,22	580	1,13	5350	R07228.0_M_-__11.A--	176	160M
11,0kW	156	9,34	659	1,05	5256	R07229.0_M_-__11.A--	176	160M
11,0kW	397	3,68	259	1,87	13605	R08223.6_M_-__11.A--	207	160M
11,0kW	280	5,21	367	1,87	13625	R08225.0_M_-__11.A--	207	160M
11,0kW	252	5,79	408	1,87	12212	R08225.6_M_-__11.A--	207	160M
11,0kW	227	6,44	454	1,87	11141	R08226.3_M_-__11.A--	207	160M
11,0kW	175	8,33	587	1,87	8529	R08228.0_M_-__11.A--	207	160M
11,0kW	156	9,35	659	1,85	6977	R08229.0_M_-__11.A--	207	160M
11,0kW	127	11,47	809	1,63	6964	R082211._M_-__11.A--	207	160M
11,0kW	113	12,92	911	1,48	7204	R082212._M_-__11.A--	207	160M
11,0kW	97	15,04	1061	1,34	7126	R082214._M_-__11.A--	207	160M
11,0kW	87	16,69	1177	1,22	7410	R082216._M_-__11.A--	207	160M
11,0kW	80	18,26	1288	1,06	8493	R082218._M_-__11.A--	207	160M
11,0kW	71	20,66	1457	1,01	8509	R082220._M_-__11.A--	207	160M
11,0kW	63	23,32	1644	0,94	8935	R082222._M_-__11.A--	207	160M
11,0kW	52	28,27	1993	0,8	9026	R082228._M_-__11.A--	207	160M
11,0kW	229	6,38	450	3,91	13594	R09226.3_M_-__11.A--	260	160M
11,0kW	178	8,22	580	3,31	13005	R09228.0_M_-__11.A--	260	160M
11,0kW	159	9,19	648	3,09	12905	R09229.0_M_-__11.A--	260	160M
11,0kW	127	11,47	809	2,66	12583	R092211._M_-__11.A--	260	160M
11,0kW	115	12,74	898	2,48	12489	R092212._M_-__11.A--	260	160M
11,0kW	100	14,53	1025	2,27	12369	R092214._M_-__11.A--	260	160M
11,0kW	89	16,34	1152	2,13	11843	R092216._M_-__11.A--	260	160M
11,0kW	79	18,5	1304	1,93	11934	R092218._M_-__11.A--	260	160M
11,0kW	71	20,59	1452	1,79	11835	R092220._M_-__11.A--	260	160M
11,0kW	64	22,87	1613	1,67	11954	R092222._M_-__11.A--	260	160M
11,0kW	52	27,98	1973	1,45	12713	R092228._M_-__11.A--	260	160M
11,0kW	45	32,31	2278	1,29	13884	R092232._M_-__11.A--	260	160M
11,0kW	41	35,67	2515	1,18	14971	R092236._M_-__11.A--	260	160M
11,0kW	34	43,35	3057	1	16802	R092245._M_-__11.A--	260	160M
11,0kW	30	49,07	3460	0,83	20075	R092250._M_-__11.A--	260	160M
11,0kW	91	15,98	1127	3,26	19927	R102216._M_-__11.A--	289	160M
11,0kW	82	17,75	1252	3,27	16631	R102218._M_-__11.A--	289	160M
11,0kW	75	19,41	1369	3,26	13551	R102220._M_-__11.A--	289	160M
11,0kW	68	21,57	1521	3,06	12891	R102222._M_-__11.A--	289	160M
11,0kW	57	25,49	1797	2,61	14561	R102228._M_-__11.A--	289	160M
11,0kW	47	30,76	2169	2,31	15018	R102232._M_-__11.A--	289	160M
11,0kW	41	35,44	2499	2	18132	R102236._M_-__11.A--	289	160M
11,0kW	36	41,12	2899	1,72	21342	R102245._M_-__11.A--	289	160M
11,0kW	30	47,93	3380	1,26	30000	R102250._M_-__11.A--	289	160M
11,0kW	28	51,49	3631	1,07	30000	R102256._M_-__11.A--	289	160M
11,0kW	25	57,63	4022	1,19	30000	R103256._M_-__11.A--	312	160M
11,0kW	22	65,24	4553	1,05	30000	R103263._M_-__11.A--	312	160M
11,0kW	20	72,62	5068	0,94	30000	R103271._M_-__11.A--	312	160M
11,0kW	18	80,68	5631	0,85	30000	R103280._M_-__11.A--	312	160M
11,0kW	44	33,25	2345	3,71	55000	R132232._M_-__11.A--	371	160M
11,0kW	39	37,03	2611	3,37	55000	R132236._M_-__11.A--	371	160M
11,0kW	34	43,25	3050	2,53	55000	R132245._M_-__11.A--	371	160M
11,0kW	29	50,7	3575	1,65	55000	R132250._M_-__11.A--	371	160M
11,0kW	27	53,94	3803	1,65	55000	R132256._M_-__11.A--	371	160M
11,0kW	31	46,79	3266	2,76	55000	R133245._M_-__11.A--	409	160M
11,0kW	28	52,97	3697	2,47	55000	R133250._M_-__11.A--	409	160M
11,0kW	24	59,76	4172	2,21	55000	R133256._M_-__11.A--	409	160M
11,0kW	22	66,4	4634	2,02	55000	R133263._M_-__11.A--	409	160M
11,0kW	20	72,6	5067	1,87	55000	R133271._M_-__11.A--	409	160M
11,0kW	18	80,68	5631	1,7	55000	R133280._M_-__11.A--	409	160M
11,0kW	15	95,34	6654	1,46	55000	R1332100_M_-__11.A--	409	160M
11,0kW	13	115,08	8032	1,21	55000	R1332112_M_-__11.A--	409	160M
11,0kW	11	132,56	9252	1,05	55000	R1332125_M_-__11.A--	409	160M
11,0kW	9,5	153,81	10735	0,9	55000	R1332160_M_-__11.A--	409	160M
11,0kW	29	50,36	3551	2,26	68000	R142250._M_-__11.A--	463	160M
11,0kW	26	56,49	3983	2,09	68000	R142256._M_-__11.A--	463	160M
11,0kW	30	48,24	3367	3,45	68000	R143245._M_-__11.A--	503	160M
11,0kW	27	54,61	3811	3,17	68000	R143250._M_-__11.A--	503	160M
11,0kW	24	61,61	4300	3,02	68000	R143256._M_-__11.A--	503	160M
11,0kW	21	68,46	4778	2,66	68000	R143263._M_-__11.A--	503	160M
11,0kW	20	74,85	5224	2,49	68000	R143271._M_-__11.A--	503	160M
11,0kW	18	83,17	5805	2,24	68000	R143280._M_-__11.A--	503	160M
11,0kW	15	98,3	6861	1,89	68000	R1432100_M_-__11.A--	503	160M
11,0kW	12	118,61	8278	1,57	68000	R1432112_M_-__11.A--	503	160M
11,0kW	20	74,49	5199	3,98	98000	R163271._M_-__11.A--	748	160M
11,0kW	18	82,13	5732	3,61	98000	R163280._M_-__11.A--	748	160M
11,0kW	15	98,51	6875	3,01	98000	R1632100_M_-__11.A--	748	160M
11,0kW	12	118,21	8250	2,51	98000	R1632112_M_-__11.A--	748	160M
11,0kW	11	128,08	8939	2,32	98000	R1632125_M_-__11.A--	748	160M
11,0kW	10	149,79	10454	1,98	98000	R1632160_M_-__11.A--	748	160M
11,0kW	8,3	175,64	12259	1,56	98000	R1632180_M_-__11.A--	748	160M
11,0kW	7,4	197,02	13751	1,06	98000	R1632200_M_-__11.A--	748	160M
11,0kW	6,4	228,84	15642	1,32	98000	R1642225_M_-__11.A--	913	160M
11,0kW	5,5	264,58	18085	1,14	98000	R1642250_M_-__11.A--	913	160M
11,0kW	5,1	285,8	19536	1,06	98000	R1642280_M_-__11.A--	913	160M
11,0kW	4,5	323,53	22115	0,94	98000	R1642300_M_-__11.A--	913	160M
11,0kW	4,1	360,14	24617	0,84	98000	R1642360_M_-__11.A--	913	160M
`;
  };
  
  // Helper function to get color for compatibility status
  const getCompatibilityColor = (status?: 'excellent' | 'good' | 'acceptable' | 'marginal') => {
    switch (status) {
      case 'excellent': return '#4CD964';
      case 'good': return '#34C759';
      case 'acceptable': return '#FFCC00';
      case 'marginal': return '#FF9500';
      default: return '#aaa';
    }
  };
  
  // Get match percentage for displaying to the user
  const getMatchPercentage = (matchScore?: number) => {
    if (matchScore === undefined) return 0;
    // Convert score to a percentage (lower score = higher percentage)
    const percentage = Math.max(0, Math.min(100, 100 - (matchScore * 100)));
    return Math.round(percentage);
  };
  
  // Render each recommended gearbox card
  const renderGearboxCard = (gearbox: GearboxItem) => {
    const isSelected = selectedGearbox?.unitDesignation === gearbox.unitDesignation;
    const matchPercentage = getMatchPercentage(gearbox.matchScore);
    
    return (
      <TouchableOpacity 
        style={[
          styles.gearboxCard,
          isSelected && styles.gearboxCardSelected
        ]}
        onPress={() => setSelectedGearbox(gearbox)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{gearbox.unitDesignation}</Text>
          <View style={[
            styles.matchBadge,
            { backgroundColor: getCompatibilityColor(gearbox.compatibilityStatus) }
          ]}>
            <Text style={styles.matchText}>{matchPercentage}% match</Text>
          </View>
        </View>
        
        <View style={styles.cardDetails}>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Công suất:</Text>
            <Text style={styles.specValue}>{gearbox.motorType}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Tỉ số truyền:</Text>
            <Text style={styles.specValue}>{gearbox.ratio}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Tốc độ đầu ra:</Text>
            <Text style={styles.specValue}>{gearbox.outputSpeedRpm} vg/ph</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Mô-men:</Text>
            <Text style={styles.specValue}>{gearbox.outputTorqueNm} Nm</Text>
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <FontAwesome name="check-circle" size={24} color="#4A90E2" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gợi Ý Hộp Giảm Tốc</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Đang phân tích và tìm hộp giảm tốc phù hợp...</Text>
        </View>
      ) : (
        <>
          {/* Thông tin yêu cầu */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông Số Yêu Cầu</Text>
            <View style={styles.requirementsContainer}>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Công suất</Text>
                <Text style={styles.requirementValue}>{requiredPower.toFixed(2)} kW</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Tốc độ</Text>
                <Text style={styles.requirementValue}>{rotationSpeed.toFixed(2)} vg/ph</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Tỉ số truyền</Text>
                <Text style={styles.requirementValue}>{totalRatio.toFixed(2)}</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={styles.requirementLabel}>Mô-men</Text>
                <Text style={styles.requirementValue}>{(torque/1000).toFixed(2)} Nm</Text>
              </View>
            </View>
          </View>
          
          {/* Hộp giảm tốc được lựa chọn */}
          {selectedGearbox && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hộp Giảm Tốc Đề Xuất</Text>
              <View style={styles.selectedGearboxContainer}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={mockAssets.gearbox}
                    style={styles.gearboxImage}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.detailsContainer}>
                  <Text style={styles.modelName}>{selectedGearbox.unitDesignation}</Text>
                  <Text style={styles.motorType}>{selectedGearbox.motorType}</Text>
                  
                  <View style={styles.mainSpecs}>
                    <View style={styles.mainSpecRow}>
                      <View style={styles.mainSpecItem}>
                        <Text style={styles.mainSpecLabel}>Tỉ số truyền</Text>
                        <Text style={styles.mainSpecValue}>{selectedGearbox.ratio}</Text>
                      </View>
                      <View style={styles.mainSpecItem}>
                        <Text style={styles.mainSpecLabel}>Tốc độ đầu ra</Text>
                        <Text style={styles.mainSpecValue}>{selectedGearbox.outputSpeedRpm} vg/ph</Text>
                      </View>
                    </View>
                    
                    <View style={styles.mainSpecRow}>
                      <View style={styles.mainSpecItem}>
                        <Text style={styles.mainSpecLabel}>Mô-men</Text>
                        <Text style={styles.mainSpecValue}>{selectedGearbox.outputTorqueNm} Nm</Text>
                      </View>
                      <View style={styles.mainSpecItem}>
                        <Text style={styles.mainSpecLabel}>Hệ số phục vụ</Text>
                        <Text style={styles.mainSpecValue}>{selectedGearbox.serviceFactor}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={[
                    styles.compatibilityBadge,
                    { backgroundColor: getCompatibilityColor(selectedGearbox.compatibilityStatus) }
                  ]}>
                    <Text style={styles.compatibilityText}>
                      {getMatchPercentage(selectedGearbox.matchScore)}% tương thích
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.comparisonContainer}>
                <Text style={styles.comparisonTitle}>So Sánh Với Yêu Cầu</Text>
                <View style={styles.comparisonTable}>
                  <View style={styles.comparisonHeader}>
                    <Text style={styles.comparisonHeaderCell}>Thông số</Text>
                    <Text style={styles.comparisonHeaderCell}>Yêu cầu</Text>
                    <Text style={styles.comparisonHeaderCell}>Đề xuất</Text>
                    <Text style={styles.comparisonHeaderCell}>Phù hợp</Text>
                  </View>
                  
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonCell}>Công suất</Text>
                    <Text style={styles.comparisonCell}>{requiredPower.toFixed(2)} kW</Text>
                    <Text style={styles.comparisonCell}>{selectedGearbox.motorType}</Text>
                    <Text style={styles.comparisonCell}>
                      {parseFloat(selectedGearbox.motorType.replace(',', '.').replace('kW', '')) >= requiredPower ? '✓' : '✗'}
                    </Text>
                  </View>
                  
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonCell}>Tốc độ</Text>
                    <Text style={styles.comparisonCell}>{rotationSpeed.toFixed(2)} vg/ph</Text>
                    <Text style={styles.comparisonCell}>{selectedGearbox.outputSpeedRpm} vg/ph</Text>
                    <Text style={styles.comparisonCell}>
                      {Math.abs(parseDecimal(selectedGearbox.outputSpeedRpm) - rotationSpeed) / rotationSpeed < 0.2 ? '✓' : '△'}
                    </Text>
                  </View>
                  
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonCell}>Tỉ số truyền</Text>
                    <Text style={styles.comparisonCell}>{totalRatio.toFixed(2)}</Text>
                    <Text style={styles.comparisonCell}>{selectedGearbox.ratio}</Text>
                    <Text style={styles.comparisonCell}>
                      {Math.abs(parseDecimal(selectedGearbox.ratio) - totalRatio) / totalRatio < 0.2 ? '✓' : '△'}
                    </Text>
                  </View>
                  
                  <View style={styles.comparisonRow}>
                    <Text style={styles.comparisonCell}>Mô-men</Text>
                    <Text style={styles.comparisonCell}>{(torque/1000).toFixed(2)} Nm</Text>
                    <Text style={styles.comparisonCell}>{selectedGearbox.outputTorqueNm} Nm</Text>
                    <Text style={styles.comparisonCell}>
                      {parseDecimal(selectedGearbox.outputTorqueNm) >= (torque/1000) ? '✓' : '✗'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.evaluationContainer}>
                <Text style={styles.evaluationTitle}>Đánh Giá:</Text>
                <Text style={styles.evaluationText}>
                  {selectedGearbox.compatibilityStatus === 'excellent' ? 
                    `Hộp giảm tốc ${selectedGearbox.unitDesignation} hoàn toàn phù hợp với các thông số yêu cầu của bạn. Đây là lựa chọn tối ưu.` :
                    selectedGearbox.compatibilityStatus === 'good' ?
                    `Hộp giảm tốc ${selectedGearbox.unitDesignation} phù hợp tốt với yêu cầu của bạn, với một số khác biệt nhỏ về tỉ số truyền hoặc tốc độ đầu ra.` :
                    selectedGearbox.compatibilityStatus === 'acceptable' ?
                    `Hộp giảm tốc ${selectedGearbox.unitDesignation} là phương án chấp nhận được, nhưng có một số khác biệt đáng kể so với thông số yêu cầu.` :
                    `Hộp giảm tốc ${selectedGearbox.unitDesignation} có thể sử dụng được nhưng không hoàn toàn phù hợp với yêu cầu của bạn.`
                  }
                </Text>
              </View>
            </View>
          )}
          
          {/* Các phương án thay thế */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Các Phương Án Thay Thế</Text>
            {matchingGearboxes.length > 0 ? (
              <FlatList
                data={matchingGearboxes}
                renderItem={({ item }) => renderGearboxCard(item)}
                keyExtractor={(item) => item.unitDesignation}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false} // Disable scrolling for the FlatList as we're in a ScrollView
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <FontAwesome name="exclamation-circle" size={40} color="#aaa" />
                <Text style={styles.noResultsText}>
                  Không tìm thấy hộp giảm tốc phù hợp với thông số đã tính toán.
                  Hãy thử điều chỉnh thông số tải hoặc xem các phương án khác.
                </Text>
              </View>
            )}
          </View>
          
          {/* Các nút chức năng */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => {
                // Lưu lại lựa chọn và chuyển sang màn hình tiếp theo
                Alert.alert(
                  "Đã chọn hộp giảm tốc",
                  `Bạn đã chọn hộp giảm tốc ${selectedGearbox?.unitDesignation || ''}`,
                  [{ text: "OK" }]
                );
              }}
            >
              <Text style={styles.buttonText}>Xác Nhận Lựa Chọn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => router.back()}
            >
              <Text style={styles.buttonSecondaryText}>Quay Lại Cấu Hình</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  requirementItem: {
    width: '48%',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  requirementLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  requirementValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedGearboxContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gearboxImage: {
    width: 100,
    height: 100,
  },
  detailsContainer: {
    flex: 1,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  motorType: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  mainSpecs: {
    marginBottom: 12,
  },
  mainSpecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mainSpecItem: {
    width: '48%',
  },
  mainSpecLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  mainSpecValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  compatibilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#4CD964',
  },
  compatibilityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  comparisonContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(44, 62, 80, 0.4)',
    borderRadius: 8,
    padding: 12,
  },
  comparisonTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comparisonTable: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
  },
  comparisonHeaderCell: {
    flex: 1,
    padding: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  comparisonCell: {
    flex: 1,
    padding: 8,
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  evaluationContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  evaluationTitle: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  evaluationText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  gearboxCard: {
    backgroundColor: 'rgba(44, 62, 80, 0.4)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gearboxCardSelected: {
    borderColor: '#4A90E2',
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CD964',
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDetails: {
    marginBottom: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  specLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  specValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noResultsText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  actionButtons: {
    marginTop: 16,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});