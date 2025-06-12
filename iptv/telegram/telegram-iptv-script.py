import argparse
import sys
sys.stdout.reconfigure(encoding='utf-8')
from telethon.sync import TelegramClient
# Replace with your actual API credentials
api_id = 29718779
api_hash = '7a112bd4f288e189f560e574250e46fa'
# Set up argument parsing
parser = argparse.ArgumentParser(description="Read messages from a Telegram channel")
parser.add_argument("channel", help="The username or ID of the Telegram channel")
args = parser.parse_args()
channel_username = args.channel  # Get the channel from the command line
# Connect to Telegram
with TelegramClient('my_session', api_id, api_hash) as client:
    messages = client.get_messages(channel_username, limit=10000)  # Adjust limit as needed
    for message in reversed(messages):  # Read oldest first
        if message.text:
            print(message.text)