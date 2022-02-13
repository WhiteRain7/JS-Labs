class value {
	constructor (parent, value = '') {
		this.name = 'value'
		this.value = value
		this.negative = false
		this.parent = parent
	}
	
	tostr () {
		return (this.negative? '-' : '') + this.value
	}

	add_digit (digit) {
		digit = digit.toString()
		if (digit == '0' && !can_add_zero(elem)) return
		else {
			elem[0].value = elem[0].value.slice(0, elem[1]) + digit + elem[0].value.slice(elem[1])
			if (elem[0].value[0] == '0' && digit != '0' && elem[1] == 1) {
				elem[0].value = elem[0].value.slice(1)
				abs_pos--
				elem[1]--
			}
			abs_pos++
			elem[1]++
		}
		renew_input()
	}

	split_by (pos) {
		let separated = this.value.slice(pos)
		this.value = this.value.slice(0, pos)
		return separated
	}

	find_elem (pos) {
		if (this.value.length == 0 && pos == 0) return [this, pos]
		else {
			if (pos < 0) return false
			else if (pos <= this.value.length) return [this, pos]
		}
		return false
	}

	renew_elem (old_elem, new_elem) {
	}

	insert_this_in_func (func_cl) {
		if (this.parent) {
			for (let i = 0; i < this.parent.values.length; i++) {
				if (this.parent.values[i] == this) {
					this.parent.values[i] = func_cl
					func_cl.parent = this.parent
					this.parent = func_cl
					for (let i2 = 0; i2 < func_cl.values.length; i2++) {
						if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
						func_cl.values[i2].parent = func_cl
					}
					return
				}
			}
		}
		else {
			e = func_cl
			func_cl.parent = this.parent
			this.parent = func_cl
			for (let i2 = 0; i2 < func_cl.values.length; i2++) {
				if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
				func_cl.values[i2].parent = func_cl
			}
			return
		}
	}

	del_left (pos) {
		if (pos == 0) {
			if (this.parent) this.parent.del_left(1)
		}
		else {
			this.value = this.value.slice(0, pos-1) + this.value.slice(pos)
			abs_pos--
			elem[1]--
		}
	}

	del_right (pos) {
		if (pos == this.value.length) {
			if (this.parent) this.parent.del_right(0)
		}
		else this.value = this.value.slice(0, pos) + this.value.slice(pos+1)
	}

	del_elem () {
		delete this
	}

	try_solve () {
		return (this.negative? '-' : '') + (this.value == ''? '0' : this.value)
	}

	change_sign () {
		this.negative = !this.negative
	}
}

//==============================================================
consts = {'ans': '0', 'π': Math.PI, 'ε': Math.E, 'ϕ': '1.618033988749894'}

class cnst {
	constructor (parent, value = '') {
		this.name = 'const'
		this.value = value
		this.negative = false
		this.parent = parent
	}
	
	tostr () {
		return (this.negative? '-' : '') + this.value
	}

	add_digit (digit) {}

	split_by (pos) {}

	find_elem (pos) {
		if (this.value.length == 0 && pos == 0) return [this, pos]
		else {
			if (pos < 0) return false
			else if (pos <= this.value.length) return [this, pos]
		}
		return false
	}

	renew_elem (old_elem, new_elem) {}

	insert_this_in_func (func_cl) {
		if (this.parent) {
			for (let i = 0; i < this.parent.values.length; i++) {
				if (this.parent.values[i] == this) {
					this.parent.values[i] = func_cl
					func_cl.parent = this.parent
					this.parent = func_cl
					for (let i2 = 0; i2 < func_cl.values.length; i2++) {
						if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
						func_cl.values[i2].parent = func_cl
					}
					return
				}
			}
		}
		else {
			e = func_cl
			func_cl.parent = this.parent
			this.parent = func_cl
			for (let i2 = 0; i2 < func_cl.values.length; i2++) {
				if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
				func_cl.values[i2].parent = func_cl
			}
			return
		}
	}

	del_left (pos) {
		if (pos == 0) {
			if (this.parent) this.parent.del_left(1)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, new value(this.parent))
				abs_pos -= elem[1]
				elem[1] = 0
			}
			else {
				e = new value('')
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_right (pos) {
		if (pos == this.tostr().length) {
			if (this.parent) this.parent.del_right(0)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, new value(this.parent))
				abs_pos -= elem[1]
				elem[1] = 0
			}
			else {
				e = new value('')
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_elem () {
		delete this
	}

	try_solve () {
		return (this.negative? '-' : '') + (consts[this.value]? consts[this.value] : '0')
	}

	change_sign () {
		this.negative = !this.negative
	}
}

//==============================================================
function deg (v) {return v*Math.PI/180}
function rad (v) {return v}
function grad(v) {return v*Math.PI/200}

function factorial(v) {
	let result = 1
	for (let i = 2; i <= v; i++) result *= i
	return result
}

svfs = {'°': 'deg', 'R': 'rad', 'g': 'grad', '!': 'factorial'}

class svf { // single-value function
	constructor (name, solve_name, parent, value) {
		this.name = name
		this.solve_name = solve_name
		this.values = [value]
		for (let i = 0; i < this.values.length; i++) if (this.values[i] != 'here') this.values[i].parent = this
		this.parent = parent
	}

	tostr () {
		return this.values[0].tostr() + this.name
	}

	add_digit (digit) {
		if (elem[1] == 0) {
			elem[0] = elem[0].values[0]
			elem[0].add_digit(digit)
		}
	}

	find_elem (pos) {
		if (pos < 0) return false
		let l_pos = pos

		if (l_pos == 0) return [this, pos]

		let finded = this.values[0].find_elem(l_pos)
		if (finded) return finded

		l_pos -= this.values[0].tostr().length
		if (l_pos == 1) return [this, pos]

		return false
	}

	renew_elem (old_elem, new_elem) {
		for (let i = 0; i < this.values.length; i++) if (this.values[i] == old_elem) {
			this.values[i] = new_elem
			break
		}
	}

	insert_this_in_func (func_cl) {
		if (this.parent) {
			for (let i = 0; i < this.parent.values.length; i++) {
				if (this.parent.values[i] == this) {
					this.parent.values[i] = func_cl
					func_cl.parent = this.parent
					this.parent = func_cl
					for (let i2 = 0; i2 < func_cl.values.length; i2++) {
						if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
						func_cl.values[i2].parent = func_cl
					}
					return
				}
			}
		}
		else {
			e = func_cl
			func_cl.parent = this.parent
			this.parent = func_cl
			for (let i2 = 0; i2 < func_cl.values.length; i2++) {
				if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
				func_cl.values[i2].parent = func_cl
			}
			return
		}
	}

	del_left (pos) {
		if (pos == 0) {
			if (this.parent) this.parent.del_left(1)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_right (pos) {
		if (pos == this.tostr().length) {
			if (this.parent) this.parent.del_right(0)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_elem () {
		for (let i = 0; i < this.values.length; i++) this.values[i].del_elem()
		delete this
	}

	try_solve () {
		let values = []
		for (let i = 0; i < this.values.length; i++) values.push(this.values[i].try_solve())
		return eval(this.solve_name + '(' + values.join(',') + ')')
	}

	change_sign () {}
}

//==============================================================
function sum (v1, v2) {return v1+v2}
function sub (v1, v2) {return v1-v2}
function mul (v1, v2) {return v1*v2}
function div (v1, v2) {return v1/v2}

function root (v1, v2) {return Math.pow(v2, 1/(v1 == 0? 2 : v1))}
function log  (v1, v2) {return Math.log(v2)/Math.log(v1)}
function exp  (v1, v2) {return v1*Math.pow(10, v2)}
function mod  (v1, v2) {return v1%v2}

ops = {'+':'sum', '-':'sub', '*':'mul', '/':'div', '^':'Math.pow', '√':'root', 'e': 'exp'}
op_priority = ['e', '√', '^', '*', '/', '-', '+']

class op { // operation
	constructor (name, solve_name, parent, value1, value2) {
		this.name = name
		this.solve_name = solve_name
		this.values = [value1, value2]
		for (let i = 0; i < this.values.length; i++) if (this.values[i] != 'here') this.values[i].parent = this
		this.parent = parent
	}

	tostr () {
		return this.values[0].tostr() + this.name + this.values[1].tostr()
	}

	add_digit (digit) {
		if (elem[1] == 0) {
			elem[0] = elem[0].values[0]
			elem[0].add_digit(digit)
		}
	}

	find_elem (pos) {
		if (pos < 0) return false
		let l_pos = pos

		let finded = this.values[0].find_elem(l_pos)
		if (finded) return finded

		l_pos -= this.values[0].tostr().length
		if (l_pos < this.name.length) return [this, pos]

		l_pos -= this.name.length
		finded = this.values[1].find_elem(l_pos)
		if (finded) return finded

		return false
	}

	renew_elem (old_elem, new_elem) {
		for (let i = 0; i < this.values.length; i++) if (this.values[i] == old_elem) {
			this.values[i] = new_elem
			break
		}
	}

	insert_this_in_func (func_cl) {
		if (this.parent) {
			for (let i = 0; i < this.parent.values.length; i++) {
				if (this.parent.values[i] == this) {
					this.parent.values[i] = func_cl
					func_cl.parent = this.parent
					this.parent = func_cl
					for (let i2 = 0; i2 < func_cl.values.length; i2++) {
						if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
						func_cl.values[i2].parent = func_cl
					}
					return
				}
			}
		}
		else {
			e = func_cl
			func_cl.parent = this.parent
			this.parent = func_cl
			for (let i2 = 0; i2 < func_cl.values.length; i2++) {
				if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
				func_cl.values[i2].parent = func_cl
			}
			return
		}
	}

	del_left (pos) {
		if (pos == 0) {
			if (this.parent) this.parent.del_left(1)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_right (pos) {
		if (pos == this.tostr().length) {
			if (this.parent) this.parent.del_right(0)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_elem () {
		for (let i = 0; i < this.values.length; i++) this.values[i].del_elem()
		delete this
	}

	try_solve () {
		let values = []
		for (let i = 0; i < this.values.length; i++) values.push(this.values[i].try_solve())
		return eval(this.solve_name + '(' + values.join(',') + ')')
	}

	change_sign () {}
}

//==============================================================
class func {
	constructor (name, solve_name, parent, ...values) {
		this.name = name
		this.solve_name = solve_name
		this.values = values
		this.negative = false
		this.parent = parent
	}

	tostr () {
		let text = ''
		text += (this.negative? '-' : '')
		text += this.name + '('
		text += this.values[0].tostr()
		for (let i = 1;  i < this.values.length; i++) {
			text += ", "
			text += this.values[i].tostr()
		}
		text += ')'
		return text
	}

	add_digit (digit) {}

	find_elem (pos) {
		if (pos < 0) return false
		if (pos <= this.name.length) return [this, pos]
		let l_pos = pos - (this.name.length + 1) // +1 due to '('
		for (let i = 0; i < this.values.length; i++) {
			let finded = this.values[i].find_elem(l_pos)
			if (finded) return finded
			else l_pos -= this.values[i].tostr().length + 2 // +2 due to ', '
		}
		if (l_pos == -1) return [this, pos]
		return false
	}

	renew_elem (old_elem, new_elem) {
		for (let i = 0; i < this.values.length; i++) if (this.values[i] == old_elem) {
			this.values[i] = new_elem
			break
		}
	}

	insert_this_in_func (func_cl) {
		if (this.parent) {
			for (let i = 0; i < this.parent.values.length; i++) {
				if (this.parent.values[i] == this) {
					this.parent.values[i] = func_cl
					func_cl.parent = this.parent
					this.parent = func_cl
					for (let i2 = 0; i2 < func_cl.values.length; i2++) {
						if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
						func_cl.values[i2].parent = func_cl
					}
					return
				}
			}
		}
		else {
			e = func_cl
			func_cl.parent = this.parent
			this.parent = func_cl
			for (let i2 = 0; i2 < func_cl.values.length; i2++) {
				if (func_cl.values[i2] == 'here') func_cl.values[i2] = this
				func_cl.values[i2].parent = func_cl
			}
			return
		}
	}

	del_left (pos) {
		if (pos == 0) {
			if (this.parent) this.parent.del_left(1)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_right (pos) {
		if (pos == this.tostr().length) {
			if (this.parent) this.parent.del_right(0)
		}
		else {
			if (this.parent) {
				this.parent.renew_elem(this, this.values[0])
				abs_pos -= elem[1]
				elem = e.find_elem(abs_pos)
			}
			else {
				e = this.values[0]
				abs_pos = 0
				elem = [e, 0]
			}
		}
	}

	del_elem () {
		for (let i = 0; i < this.values.length; i++) this.values[i].del_elem()
		delete this
	}

	try_solve () {
		let values = []
		for (let i = 0; i < this.values.length; i++) values.push(this.values[i].try_solve())
		return eval(this.solve_name + '(' + values.join(',') + ')')
	}

	change_sign () {
		this.negative = !this.negative
	}
}

function print_hierarchy (elem, offset = 0) {
	if (elem.name != 'value') {
		console.log(' '.repeat(offset)+`${elem.name} (${elem.values.length}):`)
		for (let i = 0; i < elem.values.length; i++) print_hierarchy(elem.values[i], offset+2)
	}
	else console.log(' '.repeat(offset)+`${elem.name} (${elem.value})`)
}

let e = new value('')
let elem = [e, 0]
let abs_pos = 0

function renew_input () {
	let text = e.tostr()
	t_input.innerText = text.slice(0, abs_pos) + '_' + text.slice(abs_pos)
}

function move_left () {
	if (abs_pos > 0) {
		let need_move = true
		while (', '.indexOf(t_input.innerText[abs_pos-1]) !== -1) {
			need_move = false
			abs_pos--
		}
		if (need_move) abs_pos--
		elem = e.find_elem(abs_pos)
		renew_input()
	}
}

function move_right () {
	if (abs_pos < t_input.innerText.length-1) {
		let need_move = true
		while (', '.indexOf(t_input.innerText[abs_pos+1]) !== -1) {
			need_move = false
			abs_pos++
		}
		if (need_move) abs_pos++
		elem = e.find_elem(abs_pos)
		renew_input()
	}
}

function can_add_zero (elem) {
	if (elem && elem[0].name == 'value') {
		if (elem[1] == 0) return false
		let num = elem[1]-1
		while (num >= 0 && elem[0].value[num] == '0') num--
		if (num == -1) return false
		return true
	}
	else return false
}

function add_digit (digit) {
	if (elem) elem[0].add_digit(digit)
}

function change_sign () {
	if (elem) {
		elem[0].change_sign()
		renew_input()
	}
}

function add_dec_sep () {
	if (elem && elem[0].name == 'value' && !elem[0].value.match(/\./)) {
		if (elem[0].value == '') {
			elem[0].value = '0.'
			abs_pos += 2
			elem[1] += 2
		}
		else if (elem[0].value == '0') {
			elem[0].value += '.'
			abs_pos++
			elem[1]++
		}
		else if (elem[1] == 0) {
			elem[0].value = '0.' + elem[0].value
			abs_pos += 2
			elem[1] += 2
		}
		else {
			elem[0].value = elem[0].value.slice(0, elem[1]) + '.' + elem[0].value.slice(elem[1])
			abs_pos++
			elem[1]++
		}
		renew_input()
	}
	else if (elem && Object.keys(svfs).indexOf(elem[0].name) !== -1 && elem[1] == 0) {
		elem[0] = elem[0].values[0]
		add_dec_sep()
	}
}

function add_const (value) {
	if (elem && elem[0].name == 'value' && elem[0].value == '') {
		if (elem[0].parent == '') {
			e = new cnst('', value)
			abs_pos++
			elem = [e, 1]
		}
		else {
			let new_val = new cnst(elem[0].parent, value)
			elem[0].parent.renew_elem(elem[0], new_val)
			abs_pos++
			elem = [new_val, 1]
		}
	}
	renew_input()
}

function add_svf (operation) {
	if (elem) {
		let func_cl = new svf(operation, svfs[operation], elem[0].parent, 'here')
		elem[0].insert_this_in_func(func_cl)
		elem[0] = func_cl.values[0]
		renew_input()
	}
}

function add_op (operation) {
	if (elem) {
		if (elem[1] == elem[0].tostr().length) { // if add at the end
			let first = elem[0]
			let second = new value('')
			let priority = op_priority.indexOf(operation)
			while (first.parent && op_priority.indexOf(first.parent.name) < priority) first = first.parent
			if (first.parent) {
				first.parent.renew_elem(first, new op(operation, ops[operation], first.parent, first, second))
				abs_pos++
				elem = [second, 0]
			}
			else {
				e = new op(operation, ops[operation], first.parent, first, second)
				abs_pos++
				elem = [second, 0]
			}
		}
		else if (elem[1] == 0) { // if add at the start
			let first = new value('')
			let second = elem[0]
			let priority = op_priority.indexOf(operation)
			while (first.parent && op_priority.indexOf(first.parent.name) < priority) first = first.parent
			if (first.parent) {
				first.parent.renew_elem(first, new op(operation, ops[operation], first.parent, first, second))
				abs_pos++
				elem = [second, 0]
			}
			else {
				e = new op(operation, ops[operation], first.parent, first, second)
				abs_pos++
				elem = [second, 0]
			}
		}
		else if (elem[0].name == 'value') {
			let last_parent = elem[0].parent
			let nop = new op(operation, ops[operation], elem[0].parent, elem[0], new value('', elem[0].split_by(elem[1])))
			if (last_parent) last_parent.renew_elem(elem[0], nop)
			else e = nop
			elem[0] = nop.values[0]
			elem[1] = elem[0].tostr().length
		}
	}
	renew_input()
}

function try_insert (func_cl) {
	if (elem) {
		elem[0].insert_this_in_func(func_cl)
		elem[0] = func_cl.values[0]
		if (func_cl.values.length == 1) abs_pos += func_cl.name.length+1
		else {
			abs_pos += func_cl.name.length-elem[1]+1
			elem[1] = 0
		}
		renew_input()
	}
}

function add_func (func_name) {
	switch(func_name) {
		case 'sin':
		case 'cos':
		case 'tan':
		case 'asin':
		case 'acos':
		case 'atan':
			try_insert(new func(func_name, 'Math.'+func_name, 'parent', 'here'))
			break
		case 'log':
			try_insert(new func('log', 'log', 'parent', new value(''), 'here'))
			break
		case '':
			try_insert(new func('', '', 'parent', 'here'))
			break
		case 'mod':
			try_insert(new func('mod', 'mod', 'parent', 'here', new value('')))
			break
	}
}

function t_del_left () {
	if (elem) elem[0].del_left(elem[1])
	renew_input()
}

function t_del_right () {
	if (elem) elem[0].del_right(elem[1])
	renew_input()
}

function t_clear () {
	e.del_elem()
	e = new value('')
	elem = [e, 0]
	abs_pos = 0
	renew_input()
}

function try_solve () {
	let ans = '0'
	try {ans = e.try_solve()}
	catch {ans = "Can't solve this."}
	//console.log(ans)
	renew_input()
	t_input.innerText += ' = ' + ans
	if (ans != "Can't solve this.") consts['ans'] = ans
}

function hotkey (event) {
	switch(event.key) {
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			add_digit(event.key)
			break

		case '.':
			add_dec_sep()
			break

		case '+':
		case '-':
		case '*':
		case '/':
		case '^':
			add_op(event.key)
			break
		case 's':
			add_op('√')
			break

		case 'Backspace':
			t_del_left()
			break
		case 'delete':
			t_del_right()
			break

		case 'Enter':
			try_solve()
			break

		case 'ArrowLeft':
			move_left()
			break

		case 'ArrowRight':
			move_right()
			break
	}	
}
