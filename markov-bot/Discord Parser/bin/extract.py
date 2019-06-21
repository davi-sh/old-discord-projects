import os
import csv
import string

data_dir = '..\messages'
all_output_file = '..\output\output_all.txt'
usable_output_file = '..\output\output_usable.txt'
unique_output_file = '..\output\output_unique.txt'
min_length = 6  # minimum number of words for a message to be included in usable_messages
all_messages = []  # all messages extracted, regardless of length
usable_messages = []  # messages with at least min_length words
scanned_files = 0
total_words = 0
longest_message = 0


# Collects stats on the message line by line
def parse_message(text):
    global min_length
    global all_messages
    global usable_messages
    global scanned_files
    global total_words
    global longest_message

    # translator = str.maketrans('', '', string.punctuation)
    words = len(text.split())
    if words >= min_length:
        # usable_messages.append(text.translate(translator))
        usable_messages.append(text)
    if words >= 1:
        all_messages.append(text)
        total_words += len(text)
    if words > longest_message:
        longest_message = words


# Prints out some of the collected stats
def print_results():
    global min_length
    global all_messages
    global usable_messages
    global scanned_files
    global total_words
    global longest_message

    print(len(all_messages), 'total messages in', scanned_files, 'csv files')
    print(len(usable_messages), 'messages with at least', min_length, 'words')
    print(round(total_words/len(all_messages), 2), 'average message length')


def save_uniques():
    global usable_messages
    unique_messages = set(usable_messages)
    with open(unique_output_file, 'w+', encoding='utf8') as f:
        for m in unique_messages:
            print(m, file=f)

            
def save_usable():
    global usable_messages
    with open(usable_output_file, 'w+', encoding='utf8') as f:
        for m in usable_messages:
            print(m, file=f)

            
def save_all():
    global all_messages
    with open(all_output_file, 'w+', encoding='utf8') as f:
        for m in all_messages:
            print(m, file=f)


def main():
    global min_length
    global all_messages
    global usable_messages
    global scanned_files
    global total_words
    global longest_message

    for root, dirs, files in os.walk(data_dir, topdown=False):
        # I don't actually care about directories right now
        # for name in dirs:
        #     print(os.path.join(root, name))
        for name in files:
            current_path = os.path.join(root, name)
            # splitext returns a tuple of the path (minus ext) and the extension
            # I'm going to want the full path later so it's easier to just do it separate
            current_ext = os.path.splitext(current_path)[1]
            if current_ext == '.csv':
                scanned_files+=1
                with open(current_path, encoding='utf8') as csvfile:
                    reader = csv.reader(csvfile, delimiter=',')
                    for row in reader:
                        parse_message(row[2])
    print_results()
    save_all()
    save_usable()
    save_uniques()


if __name__ == '__main__':
    main()
