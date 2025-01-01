const emojiMap = {
    terminid: '<:Terminid:1318437943135965184>',
    automaton: '<:Automaton:1318437930875879464>',
    illuminate: '<:Illuminate:1317001808614260788>',
    EnemyKills: '<:Helldiver:1318437955290923048>',
    friendlyKills: '<:DeadHD2:1318437979387068427>',
    deaths: '<:DeadHD2:1318437979387068427>',
    shotsFired: '<:HD2Gun:1318437967064469544>',
    shotsHit: '<:SupplyAmmo:1318443228512387154>',
    firstColReg: '<:1stColRegPatch:1299782940049412187>',
    HelldiverProgressBar: '<:HelldiverProgressBar:1300333411575136297>',
    EmptyProgressBar: '<:EmptyProgressBar:1306701193187164231>',
    RequisitionSlips: '<:RequisitionSlips:1306705642597126205>',
    CommonSample: '<:CommonSample:1306703600172400640>',
    RareSample: '<:RareSample:1306703568425717800>',
    AutomationProgressBar: '<:AutomationProgressBar:1300333355472261144>',
    TerminidProgressBar: '<:TerminidProgressBar:1300333028572139561>',
    IlluminateProgressBar: '<:IlluminateProgressBar:1317009125250564106>',
    ranks: {
        Constable: {
            emoji: '<:rankConstable:1323092382484271195>',
            roleId: '1322611967176740936',
            description: 'Constable'
        },
        Principle: {
            emoji: '<:rankPrinciple:1323092419155202129>',
            roleId: '1314942144628133908',
            description: 'Freedom Captain'
        },
        Steward: {
            emoji: '<:rankSteward:1323092582594777108>',
            roleId: '1322611967176740940',
            description: 'Steward'
        },
        Deployment_Officer: {
            emoji: '<:rankDeploymentOfficer:1323092770348339332>',
            roleId: '1314942144628133908',
            description: 'Deployment Officer'
        },
        Deployment_Chief: {
            emoji: '<:rankDeploymentChief:1323092855484317778>',
            roleId: '1314942144628133908',
            description: 'Deployment Chief'
        },
        Deployment_Supreme: {
            emoji: '<:rankDeploymentSupreme:1323092935608369213>',
            roleId: '1314942144628133908',
            description: 'Deployment Supreme'
        },
        Freedom_Captain: {
            emoji: '<:rankFreedomCaptain:1323093129242476584>',
            roleId: '1314942144628133908',
            description: 'Freedom Captain'
        },
        Fleet_Commander: {
            emoji: '<:rankFleetCommander:1323093162532536442>',
            roleId: '1322611967176740936',
            description: 'Fleet Commander'
        },
        IRON_Commission: {
            emoji: '<:rankIronCommission:1323097433747750912>',
            roleId: '1322611967176740936',
            description: 'IRON Commission'
        },
        High_Command: {
            emoji: '<:rankHighCommand:1323097552220065892>',
            roleId: '1322611967176740936',
            description: 'High Command'
        }
    },
    companies: {
        firstCompany: {
            emoji: '<:1stCompany:1323092218071875636>',
            roleId: '1315395939078377593',
            description: '1st Company'
        },
        secondCompany: {
            emoji: '<:2ndCompany:1323092282009845781>',
            roleId: '1322611967176740944',
            description: 'The second battalion of the regiment.'
        },
        thirdCompany: {
            emoji: '<:3rdCompany:1323092324368252948>',
            roleId: '1322611967176740944',
            description: 'The second battalion of the regiment.'
        }
    },
    medals: {
        Beacon_Of_Order: {
            emoji: '<:medalBeaconOfOrder:1323124817389555742>',
            description: 'Beacon Of Order: Great Leadership skills during combat. ',
            roleId: '1322611967176740935',
            priority: 2
        },
        Democracy_Star: {
            emoji: '<:medalDemocracyStar:1323124837232676958>',
            description: 'Democracy Star: Awarded to individuals who go out of their way for Super Earth.',
            roleId: '234567890123456789',
            priority: 1
        },
        Distinguished_Service_Medal: {
            emoji: '<:medalDistinguishedServiceMedal:1323124851053039807>',
            description: 'Distinguished Service Medal: WIP.',
            roleId: '345678901234567890',
            priority: 8
        },
        Liberators_Cross: {
            emoji: '<:medalLiberatorsCross:1323124863480631367>',
            description: 'Liberators Cross: Demonstrate dedication, courage, and selflessness in service to their brothers and the regiment.',
            roleId: '234567890123456789',
            priority: 4
        },
        Loyalty_Cross: {
            emoji: '<:medalLoyaltyCross:1323124876491624490>',
            description: 'Loyalty Cross: Awarded to dedicated squads that complete the toughest operations during their deployment.',
            roleId: '234567890123456789',
            priority: 5
        },
        Medal_Of_Freedom: {
            emoji: '<:medalMedalOfFreedom:1323124888684331019>',
            description: 'Medal Of Freedom: Awarded to members who embody the core principles of democracy through acts of service, kindness, and steadfast support for their fellow divers.',
            roleId: '234567890123456789',
            priority: 6
        },
        Medal_Of_Glory: {
            emoji: '<:medalMedalOfGlory:1323124906518511687>',
            description: 'Medal Of Glory: Awarded to those who make the ultimate sacrifice, laying down their lives to save their squad or ensure the success of the mission.',
            roleId: '234567890123456789',
            priority: 3
        },
        Medal_Of_Outstanding_Service: {
            emoji: '<:medalMedalOfOutstandingService:1323125003524247672>',
            description: 'Medal Of Outstanding Service: Awarded to those who consistently put their squad’s needs above their own.',
            roleId: '234567890123456789',
            priority: 7
        },
        Medal_Of_Unyielding_Valor: {
            emoji: '<:medalMedalOfUnyieldingValor:1323125020163313714>',
            description: 'Medal Of Unyielding Valor: Awarded to individuals with remarkable focus and determination, ignoring personal risks to complete their objectives and drive their team to success.',
            roleId: '234567890123456789',
            priority: 5
        },
        Exemplary_Service_Ribbon_Tier_1: {
            emoji: '<:ribbonExemplaryServiceRibbonT1:1323121295449128991>',
            description: 'Exemplary Service Ribbon: Tier 1 - 2 contributions.',
            roleId: '234567890123456789',
            priority: 9
        },
        Exemplary_Service_Ribbon_Tier_2: {
            emoji: '<:ribbonExemplaryServiceRibbonT2:1323121466291654688>',
            description: 'Exemplary Service Ribbon: Tier 2 - 5 contributions.',
            roleId: '234567890123456789',
            priority: 10
        },
        Exemplary_Service_Ribbon_Tier_3: {
            emoji: '<:ribbonExemplaryServiceRibbonT3:1323121504275136628>',
            description: 'Exemplary Service Ribbon: Tier 3 - 10 contributions.',
            roleId: '234567890123456789',
            priority: 11
        },
        Good_Conduct_Ribbon_Tier_1: {
            emoji: '<:ribbonGoodConductRibbonT1:1323121545492561974>',
            description: 'Good Conduct Ribbon: Tier 1 - Attend at least 3 MODs for 1 week / 1 MOD for 3 weeks.',
            roleId: '234567890123456789',
            priority: 12
        },
        Good_Conduct_Ribbon_Tier_2: {
            emoji: '<:ribbonGoodConductRibbonT2:1323121591344697446>',
            description: 'Good Conduct Ribbon: Tier 2 - Attend at least 3 MODs for 2 weeks / 1 MOD for 6 weeks.',
            roleId: '234567890123456789',
            priority: 13
        },
        Good_Conduct_Ribbon_Tier_3: {
            emoji: '<:ribbonGoodConductRibbonT3:1323121633267027998>',
            description: 'Good Conduct Ribbon: Tier 3 - Attend at least 3 MODs for 4 weeks / 1 MOD for 9 weeks.',
            roleId: '234567890123456789',
            priority: 14
        },
        Squad_Of_The_Month_Ribbon: {
            emoji: '<:ribbonSquadOfTheMonthRibbon:1323121841791045684>',
            description: 'Squad Of The Month Ribbon: Awarded to a squad with the best results on a MOD for the month.',
            roleId: '234567890123456789',
            priority: 15
        },
        Member_Of_The_Month_Ribbon: {
            emoji: '<:ribbonMemberOfTheMonthRibbon:1323121738426613781>',
            description: 'Member Of The Month Ribbon: Awarded to a member who exemplifies exceptional dedication, teamwork, and courage in service to the regiment.',
            roleId: '234567890123456789',
            priority: 16
        },
        Veterans_Ribbon: {
            emoji: '<:ribbonVeteransRibbon:1323121870253326437>',
            description: 'Veterans Ribbon: Awarded to members who served actively for over five months.',
            roleId: '234567890123456789',
            priority: 17
        },
        Enlisted_Cast_Ribbon: {
            emoji: '<:ribbonEnlistedCastRibbon:1323121272468541451>',
            description: 'Enlisted Cast Ribbon: Awarded to dedicated Stewards who show great activity. WIP',
            roleId: '234567890123456789',
            priority: 18
        },
        Deployment_Cast_Ribbon: {
            emoji: '<:ribbonDeploymentCastRibbon:12345678901234567890>',
            description: 'Deployment Cast Ribbon: Awarded to dedicated Supremes who show great activity. WIP',
            roleId: '234567890123456789',
            priority: 19
        },
        Regiment_Service_Ribbon: {
            emoji: '<:ribbonRegimentServiceRibbon:1323121787986251816>',
            description: 'Regiment Service Ribbon: Awarded to members who showed great dedication to the regiment by being active and earning 20+ IRON during their service.',
            roleId: '234567890123456789',
            priority: 20
        },
        Liberty_Blade_Decoration: {
            emoji: '<:decorationLibertyBlade:1323148481551929354>',
            description: 'Liberty Blade: This prestigious blade is awarded to deployment officers who demonstrate extraordinary leadership.',
            roleId: '234567890123456789',
            priority: 21
        },
        Silver_Eagle_Decoration: {
            emoji: '<:decorationSilverEagle:1323148495594721310>',
            description: 'Silver Eagle: Awarded to decorated members whose outstanding service and dedication have brought great pride to the regiment.',
            roleId: '234567890123456789',
            priority: 22
        },
        Gold_Eagle_Decoration: {
            emoji: '<:decorationGoldEagle:1323148509939109991>',
            description: 'Gold Eagle: Awarded to well-decorated and respectable members whose outstanding service and dedication have brought great pride to the regiment.',
            roleId: '234567890123456789',
            priority: 23
        },
        Defense_Of_Calypso_Ribbon: {
            emoji: '<:ribbonDefenseOfCalypsoRibbon:1323121992060112987>',
            description: 'Defense Of Calypso Ribbon: Awarded to members who came to defend Calypso during the unexpected attack by the Illuminate. - Date Issued: 12.11.2024 - 15.11.2024',
            roleId: '234567890123456789',
            priority: 24
        }
    }
};

module.exports = emojiMap;
