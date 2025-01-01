const emojiMap = {
    terminid: '<:Terminid:1324096552205291591>',
    automaton: '<:Automaton:1324096653623300106>',
    illuminate: '<:Illuminate:1324096711425003650>',
    EnemyKills: '<:Helldiver:1324097129790181427>',
    friendlyKills: '<:HD2Death:1324099404939923559>',
    deaths: '<:MissionFailed:1324096957165338687>',
    shotsFired: '<:HD2Gun:1324099325709651978>',
    shotsHit: '<:SupplyAmmo:1324097017856786432>',
    firstColReg: '<:1stColRegPatch:1324104484682727515>',
    EmptyProgressBar: '<:EmptyProgressBar:1324103540586713129>',
    HelldiverProgressBar: '<:HelldiverProgressBar:1324096010594685080>',
    AutomationProgressBar: '<:AutomationProgressBar:1324096239251488790>',
    TerminidProgressBar: '<:TerminidProgressBar:1324096150885761154>',
    IlluminateProgressBar: '<:IlluminateProgressBar:1324096316024029225>',
    ranks: {
        Constable: {
            emoji: '<:rankConstable:1324099848944881665>',
            roleId: '1255206691520249997',
            description: 'Constable'
        },
        Principle: {
            emoji: '<:rankprinciple:1324099929353752698>',
            roleId: '1227462822779424839',
            description: 'Principle'
        },
        Steward: {
            emoji: '<:rankSteward:1324100113907449866>',
            roleId: '1242673135900295339',
            description: 'Steward'
        },
        Deployment_Officer: {
            emoji: '<:rankDeploymentOfficer:1324100325551898634>',
            roleId: '1250097789048979526',
            description: 'Deployment Officer'
        },
        Deployment_Chief: {
            emoji: '<:rankDeploymentChief:1324100419894513825>',
            roleId: '1227464639248334858',
            description: 'Deployment Chief'
        },
        Deployment_Supreme: {
            emoji: '<:rankDeploymentSupreme:1324100537284689970>',
            roleId: '1255203659835375668',
            description: 'Deployment Supreme'
        },
        Freedom_Captain: {
            emoji: '<:rankFreedomCaptain:1324100713978003557>',
            roleId: '1308539665841782855',
            description: 'Freedom Captain'
        },
        Fleet_Commander: {
            emoji: '<:rankFleetCommander:1324100802838659132>',
            roleId: '1308539382440919041',
            description: 'Fleet Commander'
        },
        IRON_Commission: {
            emoji: '<:rankIronCommission:1324100872543801457>',
            roleId: '1290502908361707604',
            description: 'IRON Commission'
        },
        High_Command: {
            emoji: '<:rankHighCommand:1324100949387776090>',
            roleId: '1227463635513901067',
            description: 'High Command'
        }
    },
    companies: {
        firstCompany: {
            emoji: '<:1stCompany:1324099509365641297>',
            roleId: '1308535673611092018',
            description: 'The first battalion of the regiment'
        },
        secondCompany: {
            emoji: '<:2ndCompany:1324099606329692190>',
            roleId: '1308536225254211706',
            description: 'The second battalion of the regiment.'
        },
        thirdCompany: {
            emoji: '<:3rdCompany:1324099732976435361>',
            roleId: '1320849297855479839',
            description: 'The third battalion of the regiment.'
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
            roleId: '1299466362623623168',
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
            emoji: '<:ribbonDefenseOfCalypso:1324105865762050069>',
            description: 'Defense Of Calypso Ribbon: Awarded to members who came to defend Calypso during the unexpected attack by the Illuminate. - Date Issued: 12.11.2024 - 15.11.2024',
            roleId: '1318616481923334155',
            priority: 24
        }
    }
};

module.exports = emojiMap;
