import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	constructor() {}

	public game = {
		click_count : 0,
		total_count : 64,
		success_count : 0,
		points : 64,

		boxes : [],
		diamonds : [],
		diamonds_remain : [],

		game_over : false,

		create_diamonds : ()=> {
			while(this.game.diamonds.length<8) {
				let random_number = Math.floor(Math.random() * 63);
				if(this.game.diamonds.indexOf(random_number)==-1) {
					this.game.diamonds.push(random_number);
					this.game.diamonds_remain.push(random_number);
				}
			}
		},

		click_diamond_box : (box)=> {
			box.clicked = true;
			this.game.click_count++;
			this.game.points--;
			if(box.is_diamond) {
				box.success = true;
				this.game.success_count++;

				if(this.game.success_count==8) {
					this.game.save_log();
				}
			}
			else {
				box.success = false;
			}

			let index = this.game.diamonds_remain.indexOf(box.id);
			if(index > -1) {
				this.game.diamonds_remain.splice(index, 1);
			}

			this.game.get_one_diamond();

			if(this.game.success_count<8 && this.game.click_count>=56) {
				this.game.game_over = true;
			}
		},

		one_diamond : null,
		get_one_diamond : ()=> {
			if(this.game.diamonds_remain.length>1) {
				this.game.one_diamond = this.game.diamonds_remain[Math.floor(Math.random() * this.game.diamonds_remain.length)];
			}
			else {
				this.game.one_diamond = this.game.diamonds_remain[0];
			}
			setTimeout(()=> {
				this.game.one_diamond = null;
			},1000)
		},

		saved_logs : (localStorage.getItem('diamons_sweeper'))? JSON.parse(localStorage.getItem('diamons_sweeper')): [],
		save_log : ()=> {
			this.game.saved_logs.push({
				time : new Date(),
				points : this.game.points
			});
			localStorage.setItem('diamons_sweeper',JSON.stringify(this.game.saved_logs));
		},

		start_again : ()=> {
			this.game.click_count = 0;
			this.game.total_count = 64;
			this.game.success_count = 0;
			this.game.points = 64;

			this.game.boxes = [];
			this.game.diamonds = [];
			this.game.diamonds_remain = [];

			this.game.game_over = false;

			setTimeout(()=> {
				this.game.create_diamonds();
				for(let i=0;i<64;i++) {
					let box = {
						id : i,
						is_diamond : this.game.diamonds.indexOf(i)>-1,
						success : false,
						clicked : false
					}
					this.game.boxes.push(box);
				}
			})
		},
		init : ()=> {
			this.game.create_diamonds();
			for(let i=0;i<64;i++) {
				let box = {
					id : i,
					is_diamond : this.game.diamonds.indexOf(i)>-1,
					success : false,
					clicked : false
				}
				this.game.boxes.push(box);
			}
		}
	}

	ngOnInit() {
		this.game.init();
	}
}
