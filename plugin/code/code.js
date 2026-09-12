//Path: T2Editor/plugin/code/code.js

class T2CodePlugin {
    constructor(editor) {
        this.editor = editor;
        this.commands = ['insertCodeBlock'];
    }

    handleCommand(command, button) {
        switch(command) {
            case 'insertCodeBlock':
                this.insertCodeBlock();
                break;
        }
    }

    onContentSet(html) {
        // 컨텐츠 설정 시 코드 블록 초기화
        setTimeout(() => {
            this.initializeCodeBlocks();
        }, 100);
    }

    insertCodeBlock() {
        const code = document.createElement('div');
        code.className = 't2-code-block';
        
        const pre = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.textContent = '코드를 입력하세요';
        codeElement.classList.add('code-placeholder');
        codeElement.setAttribute('contenteditable', 'true');
        pre.appendChild(codeElement);
        
        this.setupCodeEvents(codeElement);
        
        code.appendChild(pre);
        this.editor.insertAtCursor(code);
    }

    setupCodeEvents(codeElement) {
        // 코드 블록 클릭 이벤트
        codeElement.addEventListener('click', function(e) {
            if (this.classList.contains('code-placeholder')) {
                this.textContent = '';
                this.classList.remove('code-placeholder');
                // 커서 위치를 처음으로 설정
                const range = document.createRange();
                const sel = window.getSelection();
                range.setStart(this, 0);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        });

        // 코드 블록 포커스 이벤트
        codeElement.addEventListener('focus', function(e) {
            if (this.classList.contains('code-placeholder')) {
                this.textContent = '';
                this.classList.remove('code-placeholder');
            }
        });

        // 코드 블록 블러 이벤트
        codeElement.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = '코드를 입력하세요';
                this.classList.add('code-placeholder');
            }
        });

        // 키보드 이벤트 추가
        codeElement.addEventListener('keydown', (e) => {
            // Tab 키 처리
            if (e.key === 'Tab') {
                e.preventDefault();
                document.execCommand('insertText', false, '    '); // 4칸 들여쓰기
            }
            
            // Enter 키 처리 (줄바꿈 허용)
            if (e.key === 'Enter') {
                // 기본 동작 허용 (줄바꿈)
                e.stopPropagation(); // 에디터의 Enter 처리와 충돌 방지
            }
        });

        // 입력 이벤트
        codeElement.addEventListener('input', () => {
            this.editor.createUndoPoint();
            this.editor.autoSave();
        });
    }

    initializeCodeBlocks() {
        this.editor.editor.querySelectorAll('.t2-code-block').forEach(codeBlock => {
            const codeElement = codeBlock.querySelector('code');
            
            if (codeElement) {
                // 이벤트가 이미 설정되지 않은 경우에만 설정
                if (!codeElement.dataset.eventsSetup) {
                    this.setupCodeEvents(codeElement);
                    codeElement.dataset.eventsSetup = 'true';
                }
            }
        });
    }
}

window.T2CodePlugin = T2CodePlugin;