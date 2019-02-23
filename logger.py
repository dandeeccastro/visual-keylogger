from pynput import keyboard as kb

def on_press(key):
    print (format(key))

print('living out of my function')
with kb.Listener(on_press = on_press) as listener:
    print('pyshell got me here')
    listener.join()

# print('testing python-shell')