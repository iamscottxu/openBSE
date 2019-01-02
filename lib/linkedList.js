//双向链表
let LinkedList = function () {
    //双向链表结点
    let node = function (element) { 
        this.element = element;
        this.next = null;
        this.previous = null;
    }

    //初始化
    let topNode = new node(null);
    let bottomNode = new node(null);
    let length = 0;
    topNode.next = bottomNode;
    bottomNode.previous = topNode;

    //公共函数
    //获取元素个数
    this.getLength = l => length;

    //插入元素（参数：元素，插入到顶部或底部）
    this.push = function (element, top) {
        let thisNode = new node(element);
        if (top) {
            thisNode.next = topNode.next;
            thisNode.previous = topNode;
            topNode.next = topNode.next.previous = thisNode;
        } else {
            thisNode.previous = bottomNode.previous;
            thisNode.next = bottomNode;
            bottomNode.previous = bottomNode.previous.next = thisNode;
        }
        length++;
    }

    //读取元素（参数：读取后是否删除，读取顶部或底部元素）
    this.pop = function (remove, top) {
        let thisNode;
        if (top) {
            thisNode = topNode.next;
            if (topNode.next != bottomNode && remove) {
                thisNode.next.previous = topNode;
                topNode.next = thisNode.next;
            }
        } else {
            thisNode = bottomNode.previous;
            if (bottomNode.previous != topNode && remove) {
                thisNode.previous.next = bottomNode;
                bottomNode.previous = thisNode.previous;
            }
        }
        if (remove) length--;
        return thisNode.element;
    }

    //清空链表
    this.clean = function(){
        topNode = new node(null);
        bottomNode = new node(null);
        topNode.next = bottomNode;
        bottomNode.previous = topNode;
        length = 0;
    }

    //遍历链表（参数：遍历回调函数，从顶到底或从底到顶）
    //回调函数
    //（参数：元素，返回：{remove：删除此元素，add:插入元素(add.addToUp:插入到上方, add.element:元素), stop：停止遍历}）
    this.forEach = function (fun, topToBottom) {
        let thisNode = topToBottom ? topNode : bottomNode;
        while (topToBottom ?
            (thisNode = thisNode.next) != bottomNode : (thisNode = thisNode.previous) != topNode) {
            let _return = fun(thisNode.element);
            if (_return) {
                if (_return.add) {
                    let newNode = new node(_return.add.element);
                    if (_return.add.addToUp){
                        newNode.previous = thisNode.previous;
                        newNode.next = thisNode;
                        thisNode.previous.next = newNode;
                        thisNode.previous = newNode;
                    } else {
                        newNode.previous = thisNode;
                        newNode.next = thisNode.next;
                        thisNode.next.previous = newNode;
                        thisNode.next = newNode;
                    }
                    length++;
                }
                if (_return.remove) {
                    thisNode.previous.next = thisNode.next;
                    thisNode.next.previous = thisNode.previous;
                    length--;
                }
                if (_return.stop) {
                    return;
                }
            }
        }
    }
}
window.LinkedList = LinkedList;