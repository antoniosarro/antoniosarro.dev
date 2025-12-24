interface Experience {
	key: number;
	position: string;
	company: string;
	dates: string[];
	descriptions: string[];
	logo?: string;
}

export const experiences: Experience[] = [
	{
		key: 1,
		position: 'Fullstack Developer',
		company: 'Freelancer',
		dates: ['2024/01/01', '2024/12/01'],
		descriptions: [
			'Developed microservices and full-stack websites primarily utilizing Golang and SvelteKit/Nextjs',
			'Gained valuable experience in direct customer communication, needs analysis, and proactive problem-solving'
		]
	},
	{
		key: 2,
		position: 'Fullstack Developer',
		company: 'ACCA Software',
		dates: ['2022/02/01', '2023/03/01'],
		descriptions: [
			'Developed microservices using Node.js, TypeScript, React, Golang to manage OpenBIM formats',
			'Deployed and scaled microservices on AWS using S3 and ECS',
			'Gained expertise in Agile methodologies, teamwork, and customer communication'
		],
		logo: 'acca'
	},
	{
		key: 3,
		position: 'Fullstack Developer',
		company: 'Freelancer',
		dates: ['2020/01/01', '2020/06/01'],
		descriptions: [
			'Developed microservices and full-stack websites primarily utilizing React and NodeJS'
		]
	},
	{
		key: 4,
		position: 'Backend Game Developer',
		company: 'Evolution Studio',
		dates: ['2019/05/01', '2019/11/01'],
		descriptions: [
			'Managed game mechanics and scripts for a mobile arcade game using Construct 3, Cordova, HTML5, CSS3, and JavaScript',
			'Implemented in-app purchases and advertising through Google Pay and AdMob',
			'Gained experience in teamwork, task management, deadline adherence, and collaborative problem-solving'
		],
		logo: 'evolution_studio'
	}
];
