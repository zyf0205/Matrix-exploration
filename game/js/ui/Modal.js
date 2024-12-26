class Modal {
    constructor(options) {
        this.options = {
            title: options.title || '',
            content: options.content || '',
            type: options.type || 'info',
            buttons: options.buttons || [{text: '确定', type: 'primary'}]
        };
        this.element = null;
    }

    create() {
        const modal = document.createElement('div');
        modal.className = `modal ${this.options.type}`;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${this.options.title}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.options.content}
                </div>
                <div class="modal-footer">
                    ${this.options.buttons.map(btn => `
                        <button class="game-btn ${btn.type}">${btn.text}</button>
                    `).join('')}
                </div>
            </div>
        `;

        this.element = modal;
        this.bindEvents();
    }

    bindEvents() {
        const closeBtn = this.element.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.hide());

        const buttons = this.element.querySelectorAll('.modal-footer button');
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (this.options.buttons[index].onClick) {
                    this.options.buttons[index].onClick();
                }
                this.hide();
            });
        });
    }

    show() {
        if (!this.element) {
            this.create();
        }
        document.body.appendChild(this.element);
    }

    hide() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
} 