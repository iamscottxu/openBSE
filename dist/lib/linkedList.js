"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 双向链表类
 */
var LinkedList = function () {
  /**
   * 创建一个双向链表。
   */
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this._topNode = new LinkedList.node(null);
    this._bottomNode = new LinkedList.node(null);
    this._length = 0;
    this._topNode._next = this._bottomNode;
    this._bottomNode._previous = this._topNode;
    this._topNode._linkedList = this._bottomNode._linkedList = this;
  }
  /**
   * 获取元素个数
   * @returns {number} 元素个数
   */


  _createClass(LinkedList, [{
    key: "push",

    /**
     * 插入节点
     * @param {*} node - 节点
     * @param {boolean} top - true: 插入到顶部 false: 插入到底部
     */
    value: function push(node) {
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (node._linkedList != null && node._linkedList != this) return false;
      if (top) return this._topNode.add(node, false);else return this._bottomNode.add(node, true);
    }
    /**
     * 读取元素
     * @param {boolean} remove - 读取后是否删除
     * @param {boolean} top - true: 读取顶部 false: 读取底部
     * @returns {*} 节点
     */

  }, {
    key: "pop",
    value: function pop() {
      var remove = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var thisNode;
      if (top) thisNode = this._topNode.next;else thisNode = this._bottomNode.previous;
      if (thisNode != null && remove) thisNode.remove();
      return thisNode;
    }
    /**
     * 清空链表
     */

  }, {
    key: "clean",
    value: function clean() {
      this._topNode._next = this._bottomNode;
      this._bottomNode._previous = this._topNode;
      this._length = 0;
    }
    /**
     * 遍历链表
     * @param {function} fun - 遍历回调函数
     * 回调函数（参数：元素，返回：{remove：删除此元素，add:插入节点(add.addToUp:插入到上方, add.node:节点), stop：停止遍历}）
     * @param {boolean} topToBottom - true: 从顶到底 false: 从底到顶
     */

  }, {
    key: "forEach",
    value: function forEach(fun, topToBottom) {
      var thisNode = topToBottom ? this._topNode : this._bottomNode;
      var nextNode = topToBottom ? thisNode._next : thisNode._previous;

      while (topToBottom ? (thisNode = nextNode) != this._bottomNode : (thisNode = nextNode) != this._topNode) {
        nextNode = topToBottom ? thisNode._next : thisNode._previous;

        var _return = fun(thisNode);

        if (_return) {
          if (_return.add) thisNode.add(_return.add.node, _return.add.addToUp);
          if (_return.remove) thisNode.remove();
          if (_return.stop) return;
        }
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }], [{
    key: "node",

    /**
     * 双向链表节点
     * @private
    */
    get: function get() {
      return function () {
        /**
         * 创建一个双向链表节点。
         * @param {*} element - 元素
         */
        function _class(element) {
          _classCallCheck(this, _class);

          this._element = element;
          this._next = null;
          this._previous = null;
          this._linkedList = null;
        }
        /**
         * 获取元素。
         */


        _createClass(_class, [{
          key: "add",

          /**
           * 添加双向链表节点。
           * @param {*} node - 节点
           * @param {*} addToUp - 插入到上方
           */
          value: function add(node) {
            var addToUp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            node.remove();

            if (addToUp) {
              node._previous = this._previous;
              node._next = this;
              this._previous._next = node;
              this._previous = node;
            } else {
              node._previous = this;
              node._next = this._next;
              this._next._previous = node;
              this._next = node;
            }

            node._linkedList = this._linkedList;
            this._linkedList._length++;
            return true;
          }
        }, {
          key: "remove",
          value: function remove() {
            if (this._next == null || this._previous == null || this._linkedList == null) return false;
            this._previous._next = this._next;
            this._next._previous = this._previous;
            this._next = this._previous = null;
            this._linkedList._length--;
            this._linkedList = null;
            return true;
          }
        }, {
          key: "element",
          get: function get() {
            return this._element;
          }
          /**
           * 获取双向链表。
           */

        }, {
          key: "linkedList",
          get: function get() {
            return this._linkedList;
          }
          /**
           * 获取上一个双向链表节点。
           */

        }, {
          key: "previous",
          get: function get() {
            if (this._linkedList === null || this._previous === this._linkedList._topNode) return null;else return this._previous;
          }
          /**
           * 获取下一个双向链表节点。
           */

        }, {
          key: "next",
          get: function get() {
            if (this._linkedList === null || this._next === this._linkedList._bottomNode) return null;else return this._next;
          }
        }]);

        return _class;
      }();
    }
  }]);

  return LinkedList;
}();

exports["default"] = LinkedList;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9saW5rZWRMaXN0LmpzIl0sIm5hbWVzIjpbIkxpbmtlZExpc3QiLCJfdG9wTm9kZSIsIm5vZGUiLCJfYm90dG9tTm9kZSIsIl9sZW5ndGgiLCJfbmV4dCIsIl9wcmV2aW91cyIsIl9saW5rZWRMaXN0IiwidG9wIiwiYWRkIiwicmVtb3ZlIiwidGhpc05vZGUiLCJuZXh0IiwicHJldmlvdXMiLCJmdW4iLCJ0b3BUb0JvdHRvbSIsIm5leHROb2RlIiwiX3JldHVybiIsImFkZFRvVXAiLCJzdG9wIiwiZWxlbWVudCIsIl9lbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR3FCQSxVO0FBQ2pCOzs7QUFHQSx3QkFBYztBQUFBOztBQUVWLFNBQUtDLFFBQUwsR0FBZ0IsSUFBSUQsVUFBVSxDQUFDRSxJQUFmLENBQW9CLElBQXBCLENBQWhCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixJQUFJSCxVQUFVLENBQUNFLElBQWYsQ0FBb0IsSUFBcEIsQ0FBbkI7QUFDQSxTQUFLRSxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUtILFFBQUwsQ0FBY0ksS0FBZCxHQUFzQixLQUFLRixXQUEzQjtBQUNBLFNBQUtBLFdBQUwsQ0FBaUJHLFNBQWpCLEdBQTZCLEtBQUtMLFFBQWxDO0FBQ0EsU0FBS0EsUUFBTCxDQUFjTSxXQUFkLEdBQTRCLEtBQUtKLFdBQUwsQ0FBaUJJLFdBQWpCLEdBQStCLElBQTNEO0FBQ0g7QUFFRDs7Ozs7Ozs7O0FBT0E7Ozs7O3lCQUtLTCxJLEVBQWtCO0FBQUEsVUFBWk0sR0FBWSx1RUFBTixJQUFNO0FBQ25CLFVBQUlOLElBQUksQ0FBQ0ssV0FBTCxJQUFvQixJQUFwQixJQUE0QkwsSUFBSSxDQUFDSyxXQUFMLElBQW9CLElBQXBELEVBQTBELE9BQU8sS0FBUDtBQUMxRCxVQUFJQyxHQUFKLEVBQVMsT0FBTyxLQUFLUCxRQUFMLENBQWNRLEdBQWQsQ0FBa0JQLElBQWxCLEVBQXdCLEtBQXhCLENBQVAsQ0FBVCxLQUNLLE9BQU8sS0FBS0MsV0FBTCxDQUFpQk0sR0FBakIsQ0FBcUJQLElBQXJCLEVBQTJCLElBQTNCLENBQVA7QUFDUjtBQUNEOzs7Ozs7Ozs7MEJBTStCO0FBQUEsVUFBM0JRLE1BQTJCLHVFQUFsQixJQUFrQjtBQUFBLFVBQVpGLEdBQVksdUVBQU4sSUFBTTtBQUMzQixVQUFJRyxRQUFKO0FBQ0EsVUFBSUgsR0FBSixFQUFTRyxRQUFRLEdBQUcsS0FBS1YsUUFBTCxDQUFjVyxJQUF6QixDQUFULEtBQ0tELFFBQVEsR0FBRyxLQUFLUixXQUFMLENBQWlCVSxRQUE1QjtBQUNMLFVBQUlGLFFBQVEsSUFBSSxJQUFaLElBQW9CRCxNQUF4QixFQUFnQ0MsUUFBUSxDQUFDRCxNQUFUO0FBQ2hDLGFBQU9DLFFBQVA7QUFDSDtBQUNEOzs7Ozs7NEJBR1E7QUFDSixXQUFLVixRQUFMLENBQWNJLEtBQWQsR0FBc0IsS0FBS0YsV0FBM0I7QUFDQSxXQUFLQSxXQUFMLENBQWlCRyxTQUFqQixHQUE2QixLQUFLTCxRQUFsQztBQUNBLFdBQUtHLE9BQUwsR0FBZSxDQUFmO0FBQ0g7QUFDRDs7Ozs7Ozs7OzRCQU1RVSxHLEVBQUtDLFcsRUFBYTtBQUN0QixVQUFJSixRQUFRLEdBQUdJLFdBQVcsR0FBRyxLQUFLZCxRQUFSLEdBQW1CLEtBQUtFLFdBQWxEO0FBQ0EsVUFBSWEsUUFBUSxHQUFHRCxXQUFXLEdBQUdKLFFBQVEsQ0FBQ04sS0FBWixHQUFvQk0sUUFBUSxDQUFDTCxTQUF2RDs7QUFDQSxhQUFPUyxXQUFXLEdBQUcsQ0FBQ0osUUFBUSxHQUFHSyxRQUFaLEtBQXlCLEtBQUtiLFdBQWpDLEdBQStDLENBQUNRLFFBQVEsR0FBR0ssUUFBWixLQUF5QixLQUFLZixRQUEvRixFQUF5RztBQUNyR2UsUUFBQUEsUUFBUSxHQUFHRCxXQUFXLEdBQUdKLFFBQVEsQ0FBQ04sS0FBWixHQUFvQk0sUUFBUSxDQUFDTCxTQUFuRDs7QUFDQSxZQUFJVyxPQUFPLEdBQUdILEdBQUcsQ0FBQ0gsUUFBRCxDQUFqQjs7QUFDQSxZQUFJTSxPQUFKLEVBQWE7QUFDVCxjQUFJQSxPQUFPLENBQUNSLEdBQVosRUFBaUJFLFFBQVEsQ0FBQ0YsR0FBVCxDQUFhUSxPQUFPLENBQUNSLEdBQVIsQ0FBWVAsSUFBekIsRUFBK0JlLE9BQU8sQ0FBQ1IsR0FBUixDQUFZUyxPQUEzQztBQUNqQixjQUFJRCxPQUFPLENBQUNQLE1BQVosRUFBb0JDLFFBQVEsQ0FBQ0QsTUFBVDtBQUNwQixjQUFJTyxPQUFPLENBQUNFLElBQVosRUFBa0I7QUFDckI7QUFDSjtBQUNKOzs7d0JBcERZO0FBQ1QsYUFBTyxLQUFLZixPQUFaO0FBQ0g7Ozs7QUFtREQ7Ozs7d0JBSWtCO0FBQ2Q7QUFDSTs7OztBQUlBLHdCQUFZZ0IsT0FBWixFQUFxQjtBQUFBOztBQUNqQixlQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtBQUNBLGVBQUtmLEtBQUwsR0FBYSxJQUFiO0FBQ0EsZUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGVBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDSDtBQUNEOzs7OztBQVhKO0FBQUE7O0FBcUNJOzs7OztBQXJDSiw4QkEwQ1FMLElBMUNSLEVBMEM4QjtBQUFBLGdCQUFoQmdCLE9BQWdCLHVFQUFOLElBQU07QUFDdEJoQixZQUFBQSxJQUFJLENBQUNRLE1BQUw7O0FBQ0EsZ0JBQUlRLE9BQUosRUFBYTtBQUNUaEIsY0FBQUEsSUFBSSxDQUFDSSxTQUFMLEdBQWlCLEtBQUtBLFNBQXRCO0FBQ0FKLGNBQUFBLElBQUksQ0FBQ0csS0FBTCxHQUFhLElBQWI7QUFDQSxtQkFBS0MsU0FBTCxDQUFlRCxLQUFmLEdBQXVCSCxJQUF2QjtBQUNBLG1CQUFLSSxTQUFMLEdBQWlCSixJQUFqQjtBQUNILGFBTEQsTUFLTztBQUNIQSxjQUFBQSxJQUFJLENBQUNJLFNBQUwsR0FBaUIsSUFBakI7QUFDQUosY0FBQUEsSUFBSSxDQUFDRyxLQUFMLEdBQWEsS0FBS0EsS0FBbEI7QUFDQSxtQkFBS0EsS0FBTCxDQUFXQyxTQUFYLEdBQXVCSixJQUF2QjtBQUNBLG1CQUFLRyxLQUFMLEdBQWFILElBQWI7QUFDSDs7QUFDREEsWUFBQUEsSUFBSSxDQUFDSyxXQUFMLEdBQW1CLEtBQUtBLFdBQXhCO0FBQ0EsaUJBQUtBLFdBQUwsQ0FBaUJILE9BQWpCO0FBQ0EsbUJBQU8sSUFBUDtBQUNIO0FBMURMO0FBQUE7QUFBQSxtQ0EyRGE7QUFDTCxnQkFBSSxLQUFLQyxLQUFMLElBQWMsSUFBZCxJQUFzQixLQUFLQyxTQUFMLElBQWtCLElBQXhDLElBQ0EsS0FBS0MsV0FBTCxJQUFvQixJQUR4QixFQUM4QixPQUFPLEtBQVA7QUFDOUIsaUJBQUtELFNBQUwsQ0FBZUQsS0FBZixHQUF1QixLQUFLQSxLQUE1QjtBQUNBLGlCQUFLQSxLQUFMLENBQVdDLFNBQVgsR0FBdUIsS0FBS0EsU0FBNUI7QUFDQSxpQkFBS0QsS0FBTCxHQUFhLEtBQUtDLFNBQUwsR0FBaUIsSUFBOUI7QUFDQSxpQkFBS0MsV0FBTCxDQUFpQkgsT0FBakI7QUFDQSxpQkFBS0csV0FBTCxHQUFtQixJQUFuQjtBQUNBLG1CQUFPLElBQVA7QUFDSDtBQXBFTDtBQUFBO0FBQUEsOEJBY2tCO0FBQ1YsbUJBQU8sS0FBS2MsUUFBWjtBQUNIO0FBQ0Q7Ozs7QUFqQko7QUFBQTtBQUFBLDhCQW9CcUI7QUFDYixtQkFBTyxLQUFLZCxXQUFaO0FBQ0g7QUFDRDs7OztBQXZCSjtBQUFBO0FBQUEsOEJBMEJtQjtBQUNYLGdCQUFJLEtBQUtBLFdBQUwsS0FBcUIsSUFBckIsSUFBNkIsS0FBS0QsU0FBTCxLQUFtQixLQUFLQyxXQUFMLENBQWlCTixRQUFyRSxFQUErRSxPQUFPLElBQVAsQ0FBL0UsS0FDSyxPQUFPLEtBQUtLLFNBQVo7QUFDUjtBQUNEOzs7O0FBOUJKO0FBQUE7QUFBQSw4QkFpQ2U7QUFDUCxnQkFBSSxLQUFLQyxXQUFMLEtBQXFCLElBQXJCLElBQTZCLEtBQUtGLEtBQUwsS0FBZSxLQUFLRSxXQUFMLENBQWlCSixXQUFqRSxFQUE4RSxPQUFPLElBQVAsQ0FBOUUsS0FDSyxPQUFPLEtBQUtFLEtBQVo7QUFDUjtBQXBDTDs7QUFBQTtBQUFBO0FBc0VIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiDlj4zlkJHpk77ooajnsbtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua2VkTGlzdCB7XG4gICAgLyoqXG4gICAgICog5Yib5bu65LiA5Liq5Y+M5ZCR6ZO+6KGo44CCXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8v5Yid5aeL5YyWXG4gICAgICAgIHRoaXMuX3RvcE5vZGUgPSBuZXcgTGlua2VkTGlzdC5ub2RlKG51bGwpO1xuICAgICAgICB0aGlzLl9ib3R0b21Ob2RlID0gbmV3IExpbmtlZExpc3Qubm9kZShudWxsKTtcbiAgICAgICAgdGhpcy5fbGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5fdG9wTm9kZS5fbmV4dCA9IHRoaXMuX2JvdHRvbU5vZGU7XG4gICAgICAgIHRoaXMuX2JvdHRvbU5vZGUuX3ByZXZpb3VzID0gdGhpcy5fdG9wTm9kZTtcbiAgICAgICAgdGhpcy5fdG9wTm9kZS5fbGlua2VkTGlzdCA9IHRoaXMuX2JvdHRvbU5vZGUuX2xpbmtlZExpc3QgPSB0aGlzO1xuICAgIH1cbiAgICAvL+WFrOWFseWHveaVsFxuICAgIC8qKlxuICAgICAqIOiOt+WPluWFg+e0oOS4quaVsFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOWFg+e0oOS4quaVsFxuICAgICAqL1xuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaPkuWFpeiKgueCuVxuICAgICAqIEBwYXJhbSB7Kn0gbm9kZSAtIOiKgueCuVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9wIC0gdHJ1ZTog5o+S5YWl5Yiw6aG26YOoIGZhbHNlOiDmj5LlhaXliLDlupXpg6hcbiAgICAgKi9cbiAgICBwdXNoKG5vZGUsIHRvcCA9IHRydWUpIHtcbiAgICAgICAgaWYgKG5vZGUuX2xpbmtlZExpc3QgIT0gbnVsbCAmJiBub2RlLl9saW5rZWRMaXN0ICE9IHRoaXMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRvcCkgcmV0dXJuIHRoaXMuX3RvcE5vZGUuYWRkKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5fYm90dG9tTm9kZS5hZGQobm9kZSwgdHJ1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOivu+WPluWFg+e0oFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVtb3ZlIC0g6K+75Y+W5ZCO5piv5ZCm5Yig6ZmkXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0b3AgLSB0cnVlOiDor7vlj5bpobbpg6ggZmFsc2U6IOivu+WPluW6lemDqFxuICAgICAqIEByZXR1cm5zIHsqfSDoioLngrlcbiAgICAgKi9cbiAgICBwb3AocmVtb3ZlID0gdHJ1ZSwgdG9wID0gdHJ1ZSkge1xuICAgICAgICBsZXQgdGhpc05vZGU7XG4gICAgICAgIGlmICh0b3ApIHRoaXNOb2RlID0gdGhpcy5fdG9wTm9kZS5uZXh0O1xuICAgICAgICBlbHNlIHRoaXNOb2RlID0gdGhpcy5fYm90dG9tTm9kZS5wcmV2aW91cztcbiAgICAgICAgaWYgKHRoaXNOb2RlICE9IG51bGwgJiYgcmVtb3ZlKSB0aGlzTm9kZS5yZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXNOb2RlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmuIXnqbrpk77ooahcbiAgICAgKi9cbiAgICBjbGVhbigpIHtcbiAgICAgICAgdGhpcy5fdG9wTm9kZS5fbmV4dCA9IHRoaXMuX2JvdHRvbU5vZGU7XG4gICAgICAgIHRoaXMuX2JvdHRvbU5vZGUuX3ByZXZpb3VzID0gdGhpcy5fdG9wTm9kZTtcbiAgICAgICAgdGhpcy5fbGVuZ3RoID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog6YGN5Y6G6ZO+6KGoXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuIC0g6YGN5Y6G5Zue6LCD5Ye95pWwXG4gICAgICog5Zue6LCD5Ye95pWw77yI5Y+C5pWw77ya5YWD57Sg77yM6L+U5Zue77yae3JlbW92Ze+8muWIoOmZpOatpOWFg+e0oO+8jGFkZDrmj5LlhaXoioLngrkoYWRkLmFkZFRvVXA65o+S5YWl5Yiw5LiK5pa5LCBhZGQubm9kZTroioLngrkpLCBzdG9w77ya5YGc5q2i6YGN5Y6Gfe+8iVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9wVG9Cb3R0b20gLSB0cnVlOiDku47pobbliLDlupUgZmFsc2U6IOS7juW6leWIsOmhtlxuICAgICAqL1xuICAgIGZvckVhY2goZnVuLCB0b3BUb0JvdHRvbSkge1xuICAgICAgICBsZXQgdGhpc05vZGUgPSB0b3BUb0JvdHRvbSA/IHRoaXMuX3RvcE5vZGUgOiB0aGlzLl9ib3R0b21Ob2RlO1xuICAgICAgICBsZXQgbmV4dE5vZGUgPSB0b3BUb0JvdHRvbSA/IHRoaXNOb2RlLl9uZXh0IDogdGhpc05vZGUuX3ByZXZpb3VzO1xuICAgICAgICB3aGlsZSAodG9wVG9Cb3R0b20gPyAodGhpc05vZGUgPSBuZXh0Tm9kZSkgIT0gdGhpcy5fYm90dG9tTm9kZSA6ICh0aGlzTm9kZSA9IG5leHROb2RlKSAhPSB0aGlzLl90b3BOb2RlKSB7XG4gICAgICAgICAgICBuZXh0Tm9kZSA9IHRvcFRvQm90dG9tID8gdGhpc05vZGUuX25leHQgOiB0aGlzTm9kZS5fcHJldmlvdXM7XG4gICAgICAgICAgICBsZXQgX3JldHVybiA9IGZ1bih0aGlzTm9kZSk7XG4gICAgICAgICAgICBpZiAoX3JldHVybikge1xuICAgICAgICAgICAgICAgIGlmIChfcmV0dXJuLmFkZCkgdGhpc05vZGUuYWRkKF9yZXR1cm4uYWRkLm5vZGUsIF9yZXR1cm4uYWRkLmFkZFRvVXApO1xuICAgICAgICAgICAgICAgIGlmIChfcmV0dXJuLnJlbW92ZSkgdGhpc05vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKF9yZXR1cm4uc3RvcCkgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiDlj4zlkJHpk77ooajoioLngrlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICovXG4gICAgc3RhdGljIGdldCBub2RlKCkge1xuICAgICAgICByZXR1cm4gY2xhc3Mge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDliJvlu7rkuIDkuKrlj4zlkJHpk77ooajoioLngrnjgIJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gZWxlbWVudCAtIOWFg+e0oFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmtlZExpc3QgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDojrflj5blhYPntKDjgIJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiOt+WPluWPjOWQkemTvuihqOOAglxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXQgbGlua2VkTGlzdCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlua2VkTGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICog6I635Y+W5LiK5LiA5Liq5Y+M5ZCR6ZO+6KGo6IqC54K544CCXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGdldCBwcmV2aW91cygpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGlua2VkTGlzdCA9PT0gbnVsbCB8fCB0aGlzLl9wcmV2aW91cyA9PT0gdGhpcy5fbGlua2VkTGlzdC5fdG9wTm9kZSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gdGhpcy5fcHJldmlvdXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIOiOt+WPluS4i+S4gOS4quWPjOWQkemTvuihqOiKgueCueOAglxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXQgbmV4dCgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGlua2VkTGlzdCA9PT0gbnVsbCB8fCB0aGlzLl9uZXh0ID09PSB0aGlzLl9saW5rZWRMaXN0Ll9ib3R0b21Ob2RlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICBlbHNlIHJldHVybiB0aGlzLl9uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiDmt7vliqDlj4zlkJHpk77ooajoioLngrnjgIJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Kn0gbm9kZSAtIOiKgueCuVxuICAgICAgICAgICAgICogQHBhcmFtIHsqfSBhZGRUb1VwIC0g5o+S5YWl5Yiw5LiK5pa5XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGFkZChub2RlLCBhZGRUb1VwID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGFkZFRvVXApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5fcHJldmlvdXMgPSB0aGlzLl9wcmV2aW91cztcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5fbmV4dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzLl9uZXh0ID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJldmlvdXMgPSBub2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuX3ByZXZpb3VzID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5fbmV4dCA9IHRoaXMuX25leHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25leHQuX3ByZXZpb3VzID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5vZGUuX2xpbmtlZExpc3QgPSB0aGlzLl9saW5rZWRMaXN0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmtlZExpc3QuX2xlbmd0aCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVtb3ZlKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uZXh0ID09IG51bGwgfHwgdGhpcy5fcHJldmlvdXMgPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5rZWRMaXN0ID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aW91cy5fbmV4dCA9IHRoaXMuX25leHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmV4dC5fcHJldmlvdXMgPSB0aGlzLl9wcmV2aW91cztcbiAgICAgICAgICAgICAgICB0aGlzLl9uZXh0ID0gdGhpcy5fcHJldmlvdXMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmtlZExpc3QuX2xlbmd0aC0tO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmtlZExpc3QgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4iXSwiZmlsZSI6ImxpYi9saW5rZWRMaXN0LmpzIn0=
