// ------------------- xSquare_item --------------------------------------------------

(function($) {

	function xSquare_item(element, options) {
		var self = this;
		this.$element = $(element);
		this.$base = this.$element;
		this.$parent = options.$parent;
		this.options = options;
		this.n = options.n;
		this.xSquare_this = options.xSquare_this;
		this.$xSquare_rotation_reverse = $(this.$element).find('div.xSquare_rotation_reverse');
		this.$x_loader_holder = $(this.$element).find('div.x_loader_holder');
		this.$first_image = this.$xSquare_rotation_reverse.find('img');
		this.$first_image_gray = this.$xSquare_rotation_reverse.find('.grayImage');
		this.$big_image_text_wrapper = this.$xSquare_rotation_reverse.find('div.big_image_text_wrapper');
		this.$a = this.$xSquare_rotation_reverse.find('a');
		this.$xSquare_text_block = $(this.$element).find('div.xSquare_text_block');
		this.$span = this.$xSquare_rotation_reverse.find('span');
		
		this.rotated=1;
		this.size=0;
		if (this.$element.height()==321) this.size = 1;
		if (this.$element.width()==321 && this.$element.height()==160) this.size=2;
		if (this.$element.width()==160 && this.$element.height()==160) this.size=3;
		if (this.size==0)
		{
			this.rotated=0;
			if (this.n==0) this.size=1;
			if (this.n==1) this.size=2;
			if (this.n>1) this.size=2;
		}
		
		this.set_position_big_image_text_wrapper();
		
		this.second_image_slided=0;
		this.second_gray_image_slided=0;
		this.second_image_src='';
		this.second_image_gray_src='';
		this.status=0;
		this.loader_active=0;
		this.stopped=0;
		this.timeout_handler1=null;
		this.timeout_handler2=null;
		this.big_image_text_wrapper_animation=0;
		
		this.first_image_src='';
		if (typeof this.$first_image != 'undefined')
		{
			if (this.$first_image.length>0)
			{
				this.first_image_src=this.$first_image.attr('src');
			}
		}
		this.first_image_gray_src='';
		if (typeof this.$first_image_gray != 'undefined')
		{
			if (this.$first_image_gray.length>0)
			{
				this.first_image_gray_src=this.$first_image_gray.attr('src');
			}
		}

		
		if (this.$a.length>0)
		{
			this.a_href=this.$a.attr('href');
			this.a_rel=this.$a.attr('rel');
			this.a_title=this.$a.attr('title');
		}
		else
		{
			this.a_href='';
			this.a_rel='';
			this.a_title='';	
		}
		
		this.text='';
		this.title='';

		if (this.$big_image_text_wrapper.length>0)
		{
			this.$h2 = this.$big_image_text_wrapper.find('h2')
			this.title = this.$h2.html();
			this.$wrapper_span = this.$big_image_text_wrapper.find('span')
			this.text = this.$wrapper_span.html();
		}
		
		if (this.$xSquare_text_block.length>0)
		{
			this.text= this.$xSquare_text_block.html();
		}


		this.$element.on('mouseenter', $.proxy(this.mouseenter, this)); 
		this.$element.on('mouseleave', $.proxy(this.mouseleave, this)); 
	};

	xSquare_item.prototype = {
		$: function (selector) {
			return this.$element.find(selector);
		},
		mouseenter: function() {
			this.xSquare_this.mouseenter();
			if ( this.$first_image_gray.length > 0 ) {
				this.$first_image_gray.hide();
			}
			if (typeof this.$second_image != "undefined") if ( this.$second_image.length > 0 ) {
				this.$second_image_gray.hide();
			}
			if (this.$big_image_text_wrapper.length>0)
			{
				var base=this;
				if (this.big_image_text_wrapper_animation==1) this.$big_image_text_wrapper.stop(true);
				this.big_image_text_wrapper_animation=1;
				this.$big_image_text_wrapper.animate({'top': this.wrapper_start_top}, this.options.speed, function(){base.big_image_text_wrapper_animation=0;});
			}
		},
		mouseleave: function() {
			this.xSquare_this.mouseleave();
			if ( this.$first_image_gray.length > 0 ) {
				this.$first_image_gray.show();
			}
			if (typeof this.$second_image != "undefined") if ( this.$second_image.length > 0 ) {
				this.$second_image_gray.show();
			}
			if (this.$big_image_text_wrapper.length>0)
			{
				var base=this;
				if (this.big_image_text_wrapper_animation==1) this.$big_image_text_wrapper.stop(true);
				this.big_image_text_wrapper_animation=1;
				this.$big_image_text_wrapper.animate({'top': this.wrapper_final_top}, this.options.speed, function(){base.big_image_text_wrapper_animation=0;});
			}
		},
		show_loader: function() {
			if (this.$x_loader_holder.length==0) this.create_loader();
			this.$x_loader_holder.show();
			this.loader_active=1;
		},
		hide_loader: function() {
			if (this.$x_loader_holder.length==0) return;
			this.$x_loader_holder.hide();
			this.loader_active=0;
		},
		stop: function() {
			if (this.status==2)
			{
				if (typeof this.$second_image != 'undefined')
				{
					if (this.$second_image.length>0)
					{
						this.$second_image.stop();
						this.$second_image_gray.stop();
						
					}
				}
				if (typeof this.$span != 'undefined')
				{
					if (this.$span.length>0) this.$span.stop();
				}
			}
			
			if (this.prepared_for==1)
			{
				if (typeof this.$first_image != 'undefined')
				{
					if (this.$first_image.length>0)
					{
						this.$xSquare_rotation_reverse.removeClass('xSquare_text_block');
						if (this.$first_image.attr('src')=='')
						{
							this.$first_image.attr('src', this.second_image_src);
							this.$first_image_gray.attr('src', this.second_image_gray_src);
						}
						if (this.$first_image.is(":visible")==false) this.$first_image.show();
						if (this.$first_image_gray.is(":visible")==false) this.$first_image_gray.show();
						if (typeof this.$span!='undefined')
						{
							if (this.$span.length>0)
							{
								this.$span.remove();
								this.$span.length=0;
							}
						}
					}
				}
			}
			if (this.prepared_for==2)
			{
				this.$xSquare_rotation_reverse.addClass('xSquare_text_block');
				this.remove_image();
				if (typeof this.$span=='undefined') this.create_span();
				if (this.$span.length==0)  this.create_span();
				if (this.$span.length>0) this.$span.css({'left': '0', 'position': ''});
			}

			this.stopped=1;
			this.reset_status();
		},
		load_image: function(src, gray_src) {
			this.show_loader();
			this.second_image_slided=0;
			this.second_gray_image_slided=0;
			this.stopped=0;
			if (src=="" || gray_src=="")
			{
				this.second_image_src="";
				this.second_image_gray_src="";
				this.status=0;
				this.prepared_for=2;
				return;
			}
			this.prepared_for=1;
			if (this.$first_image.length==0)
			{
				this.create_image(src, gray_src);
			}
			var css_pos;
			css_pos=this.$first_image.css('left');
			css_pos=css_pos.replace('px', '');
			this.img_default_left = parseInt(css_pos);

			if (this.size == 1) this.img_width=478; // this.$first_image.width();
			if (this.size == 2) this.img_width=357;
			if (this.size == 3) this.img_width=236;
			this.img_init_left = this.img_width+this.img_default_left;

			this.second_image_src=src;
			this.second_image_gray_src=gray_src;
			this.second_image_src_backup=src;
			this.second_image_gray_src_backup=gray_src;
			
			this.second_gray_image_loaded=0;
			this.second_image_loaded=0;
			
			this.$new_images_holder = $('<div class="xSquare_rotation_reverse" style="z-index: 3; position: relative;">');
			this.$element.prepend(this.$new_images_holder);

			this.$second_image = $('<img src="'+src+'" style="z-index: 3; left: '+this.img_init_left+'px;" />');
			var base=this;
			this.$second_image.load(function() {
				base.image_loaded_callback();
			});
			this.$new_images_holder.prepend(this.$second_image);

			this.$second_image_gray = $('<img src="'+gray_src+'" style="z-index: 4; left: '+this.img_init_left+'px;" />');
			var base=this;
			this.$second_image_gray.load(function() {
				base.image_gray_loaded_callback();
			});
			this.$new_images_holder.prepend(this.$second_image_gray);
			},
		image_loaded_callback: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.second_image_loaded=1;;
			if (this.second_gray_image_loaded==1) this.status=1; // image ready
		},
		image_gray_loaded_callback: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.second_gray_image_loaded=1;
			if (this.second_image_loaded==1) this.status=1; // image ready
		},
		slide: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			var self=this;

			if (this.$first_image.length>0 && this.second_image_src=="")
			{
				this.remove_image();
			}

			if (this.$first_image.length==0 && this.title=="" && this.text!="")
			{
				this.status=2;
				this.create_span();
				this.hide_loader();
				if (this.$span.length>0) this.$span.animate({'left': '0px'}, this.options.speed, this.options.easing, function(){ self.span_done(); });
				return;
			}

			if (this.$span.length>0)
			{
				this.$span.remove();
				this.$span.length=0;
			}
			this.second_image_slided=0;
			this.second_gray_image_slided=0;
			this.status=2;
			this.timeout_handler1=null;
			this.timeout_handler2=null;
			this.$second_image.animate({left: this.img_default_left}, this.options.speed, this.options.easing, function(){ self.slide_done(); });
			this.$second_image_gray.animate({left: this.img_default_left}, this.options.speed, this.options.easing, function(){ self.slide_gray_done(); });
		},
		slide_done: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.$first_image.attr('src', this.second_image_src_backup);
			if (this.$first_image.is(":visible")==false) this.$first_image.show();
			var self=this;
			this.timeout_handler1=setTimeout(function(){self.remove_second_image();},0);
		},
		slide_gray_done: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.$first_image_gray.attr('src', this.second_image_gray_src_backup);
			if (this.$first_image_gray.is(":visible")==false) this.$first_image_gray.show();
			var self=this;
			this.timeout_handler2=setTimeout(function(){self.remove_second_gray_image();},0);
		},
		span_done: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.status=3;
			if (this.$span.length>0) this.$span.css({'left': '0', 'position': ''});
			this.hide_loader();
		},
		remove_second_image: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.$second_image.remove();
			this.$second_image.length=0;
			this.second_image_slided=1;
			if (this.second_gray_image_slided==1) this.done();
		},
		remove_second_gray_image: function() {
			if (this.stopped==1) {this.reset_status(); return;}
			this.$second_image_gray.remove();
			this.$second_image_gray.length=0;
			this.second_gray_image_slided=1;
			if (this.second_image_slided==1) this.done();
		},
		done: function() {
			this.status=3;
			this.hide_loader();
			
			if (this.$new_images_holder.length>0)
			{
				this.$new_images_holder.remove();
				this.$new_images_holder.length=0;
			}
			if (this.$xSquare_rotation_reverse.hasClass('xSquare_text_block') && this.$first_image.length>0)
			{
				this.$xSquare_rotation_reverse.removeClass('xSquare_text_block');
			}
		},
		reset_status: function() {
			if (this.timeout_handler1!=null) clearTimeout(this.timeout_handler1); 
			if (this.timeout_handler2!=null) clearTimeout(this.timeout_handler2); 
			this.status=0;
			if (typeof this.$second_image != "undefined") if (this.$second_image.length>0) {this.$second_image.remove(); this.$second_image.length=0;}
			if (typeof this.$second_image_gray != "undefined")if (this.$second_image_gray.length>0) {this.$second_image_gray.remove(); this.$second_image_gray.length=0;}
			if (typeof this.$new_images_holder != "undefined") if (this.$new_images_holder.length>0) {this.$new_images_holder.remove(); this.$new_images_holder.length=0;}
			
			this.second_image_slided=0;
			this.second_gray_image_slided=0;
			this.second_image_src='';
			this.second_image_gray_src='';
			this.loader_active=0;
			if (this.$span.length>0) this.$span.css({'left': '0', 'position': ''});
		},
		set_position_big_image_text_wrapper: function() {
			if (this.$big_image_text_wrapper.length>0)
			{
				if (this.size == 1)
				{
					var css_pos=this.$big_image_text_wrapper.css('top');
					css_pos=css_pos.replace('px', '');
					this.wrapper_start_top = parseInt(css_pos);
					this.wrapper_final_top = this.wrapper_start_top*3;
				}
				if (this.size == 2)
				{
					this.wrapper_start_top = 60;
					this.wrapper_final_top = 230;
					this.$big_image_text_wrapper.css({'left': -80});
				}
				if (this.size == 3)
				{
					this.wrapper_start_top = 55;
					this.wrapper_final_top = 170;
					this.$big_image_text_wrapper.css({'left': -215});
				}
				this.$big_image_text_wrapper.css({'top': this.wrapper_final_top});
			}
		},
		create_image: function(src, gray_src) {
			var ok=0;
			if (typeof this.$first_image == undefined)
			{
				ok=1;
			}
			if (this.$first_image.length==0 || ok==1)
			{
				this.$first_image_gray = $('<img src="'+gray_src+'" class="grayImage" style="display: none;" />');
				this.$xSquare_rotation_reverse.prepend(this.$first_image_gray);

				this.$first_image = $('<img src="'+src+'" style="display: none;" />');
				this.$a=$('<a>');
				this.$a.prepend(this.$first_image);
				
				this.$xSquare_rotation_reverse.prepend(this.$a);

				this.$first_image = this.$xSquare_rotation_reverse.find('img');
				this.$first_image_gray = this.$xSquare_rotation_reverse.find('.grayImage');
			}
		},
		create_span: function() {
			this.$xSquare_rotation_reverse.html(this.text);
			this.$span = this.$xSquare_rotation_reverse.find('span');
			this.$span.css({'left': '150px', 'position': 'relative'});
			
		},
		remove_image: function() {
			if (this.$first_image.length>0)
			{
				this.$first_image_gray.remove();
				this.$first_image_gray.length=0;
				this.$first_image.remove();
				this.$first_image.length=0;
				this.$a.remove();
				this.$a.length=0;
				
				if (this.$xSquare_rotation_reverse.hasClass('xSquare_text_block')==false)
				{
					this.$xSquare_rotation_reverse.addClass('xSquare_text_block');
				}
			}		
			this.create_span();
		},
		create_loader: function() {
			if (this.$x_loader_holder.length==0)
			{
				this.$x_loader_holder = $('<div class="x_loader_holder" style="display: none;"><img src="images/ajax-loader.gif" alt="" /></div>');
				this.$element.prepend(this.$x_loader_holder);
			}
		},
		create_wrapper: function() {
			if (this.$big_image_text_wrapper.length==0)
			{
				this.$big_image_text_wrapper=$('<div class="big_image_text_wrapper">')
				this.$xSquare_rotation_reverse.append(this.$big_image_text_wrapper);
				this.set_position_big_image_text_wrapper();
			}
		},
		apply_content: function() {
			if (this.text!="" && this.title!="")
			{
				if (this.$big_image_text_wrapper.length==0) this.create_wrapper();
				this.$big_image_text_wrapper.html('<h2>'+this.title+'</h2><span>'+this.text+'</span>');
			}
			if (this.title=="" && this.$big_image_text_wrapper.length>0)
			{
				this.$big_image_text_wrapper.remove();
				this.$big_image_text_wrapper.length=0;
			}
				
			if (this.$a.length>0)
			{
				if (this.a_rel=="")
				{
					if (typeof this.$a.attr('rel') != "undefined") this.$a.removeAttr('rel');
				}
				else
				{
					this.$a.attr('rel', this.a_rel);
				}
				if (this.a_title=="")
				{
					if (typeof this.$a.attr('title') != "undefined") this.$a.removeAttr('title');
				}
				else
				{
					this.$a.attr('title', this.a_title);
				}
				this.$a.attr('href', this.a_href);
			}
		}
	};

// ----------------- xSquare ----------------------------------------------------

	function xSquare(element, options) {
		var self = this;
		this.$element = $(element);
		this.$base = this.$element;
		this.options = $.extend({}, $.fn.xSquare.defaults, options);

		this.in_process=0;
		this.waiting_for=0;
		this.timeout_handler=null;
		this.items_counts=0;
		this.active_layer=0;
		this.is_auto_play=0;
		this.dismiss_auto_play=0;
		
		this.$element.html(this.generate_html());
		
		this.$items = this.$('div.xSquare_image');
		this.$scroller_left = this.$('.xSquare_left');
		this.$scroller_right = this.$('.xSquare_right');
		
		//this.$element.on('mouseenter', $.proxy(this.mouseenter, this));
		//this.$element.on('mouseleave', $.proxy(this.mouseleave, this));

		this.$scroller_left.on('mouseenter', $.proxy(this.scroller_left_mouseenter, this.$scroller_left));
		this.$scroller_left.on('mouseleave', $.proxy(this.scroller_left_mouseleave, this.$scroller_left));
		this.$scroller_left.on('click', $.proxy(this.go_left, this));
		this.$scroller_right.on('mouseenter', $.proxy(this.scroller_right_mouseenter, this.$scroller_right));
		this.$scroller_right.on('mouseleave', $.proxy(this.scroller_right_mouseleave, this.$scroller_right));
		this.$scroller_right.on('click', $.proxy(this.go_right, this));
		
		$(window).on('keydown', $.proxy(this.keypress, this));

		if (typeof this.options.map == 'undefined') return;
		if (this.options.map == null) return;
	
		this.number_of_maps=this.options.map.length;

		var nn=0;
		this.items=new Array();
		$.each( this.$items, function(i, element) {
			self.items[nn]=new xSquare_item(element, $.extend(self.options, {$parent: self.$element, xSquare_this: self, n:nn }) );
			nn++;
		});
		this.items_counts=nn+1;

		
		this.my_map=this.options.map;
	};

	xSquare.prototype = {
		$: function (selector) {
			return this.$element.find(selector);
		},
		mouseenter: function() {
			// console.log('mouseenter()');
			if (this.is_auto_play==1)
			{
				this.dismiss_auto_play=1;
				// console.log('mouseenter() is_auto_play==1, dismiss_auto_play=1');
			}
		},
		mouseleave: function() {
			// console.log('mouseleave()');
			this.dismiss_auto_play=0;
			// console.log('mouseleave() dismiss_auto_play=0');
		},
		generate_html: function() {
			var newHtml = '\n'+
'		<a href="#" class="xSquare_left"><span></span></a>\n'+
'		<a href="#" class="xSquare_right"><span></span></a>\n'+
'		<div class="xSquare_wrapper">\n';

			var currentMap = this.options.map[this.active_layer];


			for (i=0; i<currentMap.length; i++) {
				newHtml += '\n'+
'			<div class="xSquare_image'+(i+1)+' xSquare_image">\n'+
'				<div class="x_loader_holder" style="display: none;"><img src="images/ajax-loader.gif" alt="" /></div>\n'+
'				<div class="xSquare_rotation_reverse '+(((typeof currentMap[i].image == 'undefined') || currentMap[i].image == '') ? ' xSquare_text_block' : '')+'">\n';
				if((typeof currentMap[i].image == 'undefined') || currentMap[i].image == '') {
					newHtml += currentMap[i].text;
				}
				else {
					if((typeof currentMap[i].a_href != 'undefined') && currentMap[i].a_href != '') {
						newHtml += '<a target="_blank" href="'+currentMap[i].a_href+'"'+
						(((typeof currentMap[i].a_rel != 'undefined') && currentMap[i].a_rel != '') ? ' rel="'+currentMap[i].a_rel+'"' : '')+
						(((typeof currentMap[i].a_title != 'undefined') && currentMap[i].a_title != '') ? ' title="'+currentMap[i].a_title+'"' : '')+
						'>';
					}
					
					newHtml += '<img src="'+currentMap[i].image+'" alt="" />';
					if((typeof currentMap[i].a_href != 'undefined') && currentMap[i].a_href != '') {
						newHtml += '</a>';
					}
					
					newHtml += '<img class="grayImage" src="'+currentMap[i].gray_image+'" alt="" />';
					
					if(((typeof currentMap[i].title != 'undefined') && currentMap[i].title != '')
						|| ((typeof currentMap[i].text != 'undefined') && currentMap[i].text != '')) {
					
						newHtml += 
						
'					<div class="big_image_text_wrapper">\n'+
'						<h2>'+currentMap[i].title+'</h2>\n'+
'						<span>'+currentMap[i].text+'</span>\n'+
'					</div><!-- big_image_text_wrapper -->\n';
					}
					
				}

				newHtml += '\n'+
'				</div><!-- xSquare_rotation_reverse -->\n'+
'			</div><!-- xSquare_image_'+(i+1)+' -->\n';
			}
			newHtml+=
'		</div>\n'+
'		<div class="xSquare_title xSquare_rotation_reverse">\n'+
		this.options.title+
'		</div><!-- xSquare_title -->\n';
			return newHtml;
		},
		
		destroy: function() {
			this.$element.html('').data('xSquare', false);
		},
		scroller_left_mouseenter: function() {
			$(this).stop(true).animate({paddingRight: 10, left:15}, 300);		
		},
		scroller_left_mouseleave: function() {
			$(this).stop(true).animate({paddingRight: 0,left: 25}, 300);
		},
		scroller_right_mouseenter: function() {
			$(this).stop(true).animate({paddingLeft: 10,right: 15}, 300);
		},
		scroller_right_mouseleave: function() {
			$(this).stop(true).animate({paddingLeft: 0,right: 25}, 300);
		},
		reset_status: function() {
			this.in_process=0;
			var nn=this.items_counts-1;
			var i;
			for (i=0; i<nn; i++)
			{
				this.items[i].stop();
			}
		},
		go_left: function(e) {
			if (typeof e != 'undefined') e.preventDefault();
			this.$element.trigger('left_click');
			if (this.in_process==1)
			{
				if (this.timeout_handler!=null) clearTimeout(this.timeout_handler);
				this.reset_status();
			}
			var layers=this.my_map.length;
			if (this.active_layer>0) this.active_layer--;
			else this.active_layer=layers-1;
			this.go_to_layer(this.active_layer);
		},
		go_right: function(e) {
			if (typeof e != 'undefined') e.preventDefault();
			// console.log('go_right()');
			// console.log('go_right() auto_play='+this.is_auto_play);
			// console.log('go_right() dismiss_auto_play='+this.dismiss_auto_play);
			if (this.is_auto_play==1 && this.dismiss_auto_play==1)
			{
				// console.log('go_right() return;')
				return;
			}
			this.$element.trigger('right_click');
			if (this.in_process==1)
			{
				if (this.timeout_handler!=null) clearTimeout(this.timeout_handler);
				this.reset_status();
			}
			var layers=this.my_map.length;
			if (this.active_layer+1<layers) this.active_layer++;
			else this.active_layer=0;
			this.go_to_layer(this.active_layer);
		},
		keypress: function(e) {
			if (e.keyCode==37) this.go_left();
			if (e.keyCode==39) this.go_right();
		},
		set_new_map: function(map)
		{
			this.my_map=map;
			if (this.active_layer>=this.my_map.length) this.active_layer=this.my_map.length-1;
			this.go_to_layer(this.active_layer);			
		},
		go_to_layer: function(layer) {
			if (this.items_counts==0) return;
			this.active_layer=layer;
			this.in_process=1;
			var i=0;
			var n=this.items_counts-1;
			var s1='', s2='';
			for (i=0; i<n; i++)
			{
				this.items[i].second_image_src='';
				this.items[i].second_image_gray_src='';
				this.items[i].load_image(this.my_map[layer][i].image, this.my_map[layer][i].gray_image);
				this.items[i].a_href = this.my_map[layer][i].a_href;
				this.items[i].a_rel = this.my_map[layer][i].a_rel;
				this.items[i].a_title = this.my_map[layer][i].a_title;
				this.items[i].text = this.my_map[layer][i].text;
				this.items[i].title = this.my_map[layer][i].title;
				this.items[i].apply_content();
			}
			this.slided=0;

			this.waiting_process();
		},
		waiting_process: function()
		{
			var i=0;
			var n=this.items_counts-1;
			var self=this;
			var waiting=0;
			for (i=0; i<n; i++)
			{
				if (this.items[i].status==0 && this.items[i].title=="" && this.items[i].text!=0 && this.slided>0) this.items[i].status=1;
				if (this.items[i].status==1)
				{
					this.items[i].slide();
					this.slided++;
					this.timeout_handler=setTimeout(function(){self.waiting_process();}, 150);
					return;				
				}
				if (this.items[i].status==0) waiting++;
			}
			if (waiting>0)
			{
				this.timeout_handler=setTimeout(function(){self.waiting_process();}, 50);
				return;
			}
			for (i=0; i<n; i++)
			{
				if (this.items[i].status==2)
				{
					this.timeout_handler=setTimeout(function(){self.waiting_process();}, 100);
					return;				
				}
			}
			
			for (i=0; i<n; i++)
			{
				this.items[i].reset_status();
			}
			this.in_process=0;
			this.$element.trigger('animation_over');
		},
		auto_play: function(pause_time)
		{
			var self=this;
			this.dismiss_auto_play=0;
			this.is_auto_play=1;
			this.timeout_autoplay_handler=setInterval(function(){self.go_right();}, pause_time);
		},
		stop_auto_play: function()
		{
			this.dismiss_auto_play=1;
			if (this.is_auto_play==1)
			{
				clearInterval(this.timeout_autoplay_handler);
			}
			this.is_auto_play=0;
		},
		get_auto_play_status: function()
		{
			// console.log ('this.is_auto_play = ' + this.is_auto_play);
			return this.is_auto_play;
		}
	};

	$.fn.xSquare = function ( option, scnd ) {
		// return this.each(function () {
			var $this = $(this),
				data = $this.data('xSquare'),
				options = typeof option == 'object' && option;
			data || $this.data('xSquare', (data = new xSquare(this, options)));
			
			if (typeof scnd !== 'undefined') return data[option](scnd);
			else
			{
				if (typeof option == 'string')
				{
					return data[option]();
				}
			}
		// });
	};

	$.fn.xSquare.Constructor = xSquare;
	$.fn.xSquare.defaults = {
		map:	null,
		easing:	'swing',
		speed: 'slow',
		title: '<span class="black">BIG TITLE</span><span>SMALL TITLE</span>'
	};
})(jQuery);
