#!/usr/bin/perl

use strict;
use warnings;

my $default_encoding = '<:encoding(UTF-8)';
my %custom_encodings;
my @command_line_arguments = @ARGV;

my $source_directory;
my $source_filename;

my %included_files_from_source;

my $destination_directory;
my $destination_filename;
my $destination_extension;

my %included_source_file_data;

my @index_htm_hat;
my @index_htm_hair;
my @index_htm_head;
my @index_htm_neck;
my @index_htm_body;
my @index_htm_leg;
my @index_htm_foot;

my @index_htm;

my @expected_source_files = ( \@index_htm_hat, \@index_htm_hair, \@index_htm_head, \@index_htm_neck, \@index_htm_body, \@index_htm_leg, \@index_htm_foot );

sub evaluate_arguments {
	if( $command_line_arguments[0] eq '--buildnewdefault' ){
		my $creation_directory = $command_line_arguments[1];
		my $creation_prefix = $command_line_arguments[2];
		my $creation_extension = $command_line_arguments[3];
		my @creation_standard_files = ( "hat", "hair", "head", "neck", "body", "leg", "foot" );
		
		unless(-e $creation_directory or mkdir $creation_directory){
			die "Unable to create $creation_directory"
		}
		

		my $temporary_filename = $creation_directory.'siteincludelist';
		open(my $fh_includelist, '>', $temporary_filename)
			or die "could not create $temporary_filename\n";

		print $fh_includelist '#siteincludelist'."\r\n";

		foreach ( @creation_standard_files ){
			$temporary_filename = $creation_directory.$creation_prefix.'_'.$creation_extension.'_'.$_;
		
			print $fh_includelist '#'.$_.':'.$temporary_filename."\r\n";
	
			open(my $fh, '>', $temporary_filename)
				or die "Could not create $temporary_filename\n";

			if( $_ eq 'hat' ){
				print $fh "#hat\r\n<!doctype html>\n\r";
			}elsif ( $_ eq 'hair' ){
				print $fh "#hair\r\n<html>\r\n";
			}elsif ( $_ eq 'head' ){
				print $fh "#head\r\n<head>\r\n</head>\r\n";
			}elsif ( $_ eq 'neck' ){
				print $fh "#neck\r\n";
			}elsif ( $_ eq 'body' ){
				print $fh "#body\r\n<body>\r\n</body>\r\n";
			}elsif ( $_ eq 'leg' ){
				print $fh "#leg\r\n";
			}elsif ( $_ eq 'foot' ){
				print $fh "#foot\r\n</html>\r\n";
			}
			print $fh "<!-- START $_ -->\r\n\r\n<!-- END $_ -->\r\n";
			close $fh;
		}

		close $fh_includelist;

		exit;

	}

	if( $#command_line_arguments < 4 ){
		$source_directory = './';
		$source_filename = 'siteincludelist';
		$destination_directory = './';
		$destination_filename = 'index';
		$destination_extension = 'htm';
	} else {
		$source_directory = $command_line_arguments[0];
		$source_filename = $command_line_arguments[1];
		$destination_directory = $command_line_arguments[2];
		$destination_filename = $command_line_arguments[3];
		$destination_extension = $command_line_arguments[4];
	}

	read_source_file( [ $default_encoding, $source_directory.$source_filename ], [] );
}

sub load_stage_source_process {
	my @source_val = @{$_[0]};
	my $return_val = \%included_files_from_source;
	my $what_am_i;

	my $this_file_type = $source_val[0];
	trying_to_clean ( \$this_file_type );

	shift @source_val;


	if ( $this_file_type =~ m/#siteincludelist/ ){
		$what_am_i = 'trunk';

		foreach ( @source_val ) {
			trying_to_clean ( \$_ );
			my @prospective_inclusion = split ( /:/, $_ );
			$custom_encodings{$prospective_inclusion[0]} = $default_encoding;		

			if ( $#prospective_inclusion == 2 ){
				$custom_encodings{$prospective_inclusion[0]} = pop (@prospective_inclusion);
			}

			if ( $#prospective_inclusion == 1 ){
				$included_files_from_source{$prospective_inclusion[0]} = $prospective_inclusion[1];
			}
		}

		foreach ( keys %included_files_from_source ) {
			$included_source_file_data{"$_"} = [];
			my $included_source_file_path = $included_files_from_source{$_};

			read_source_file( [ $default_encoding, $included_source_file_path ], $included_source_file_data{$_} );
		}
	}elsif ( $this_file_type =~ m/#hat/ ){
		$what_am_i = 'hat';
		@index_htm_hat = @source_val;
	}elsif ( $this_file_type =~ m/#hair/ ){
		$what_am_i = 'hair';
		@index_htm_hair = @source_val;
	}elsif ( $this_file_type =~ m/#head/ ){
		$what_am_i = 'head';
		@index_htm_head = @source_val;
	}elsif ( $this_file_type =~ m/#neck/ ){
		$what_am_i = 'neck';
		@index_htm_neck = @source_val;
	}elsif ( $this_file_type =~ m/#body/ ){
		$what_am_i = 'body';
		@index_htm_body = @source_val;
	}elsif ( $this_file_type =~ m/#leg/ ){
		$what_am_i = 'leg';
		@index_htm_leg = @source_val;
	}elsif ( $this_file_type =~ m/#foot/ ){
		$what_am_i = 'foot';
		@index_htm_foot = @source_val;
	}

	print ( @source_val );

	return $return_val;
}

sub trying_to_clean {

	${$_[0]} =~ s/^\s*\b(.*)\b\s*$/$1/;
	${$_[0]} =~ s/\r\n//g;
}

sub read_source_file {
	my @prospective_file = @{$_[0]};
	my @return_val = @{$_[1]};

	@return_val = ();

	open(my $source_fh, "$prospective_file[0]", "$prospective_file[1]")
		or die "Could not open source file: '$prospective_file[1]' $!";

	while (my $line = <$source_fh>) {
		$return_val[++$#return_val] = $line;
	}

	close $source_fh;	

	load_stage_source_process( \@return_val );

	return \@return_val;
}

sub write_index_htm_hat {
	#perform substitutions in array according to additional inclusions

	$index_htm_hat[1] = <<"BEFORE_HTML_OPEN";
	@index_htm_hat
BEFORE_HTML_OPEN
}

sub write_index_htm_hair {
	$index_htm_hair[1] = <<"HTML_TO_BEFORE_HEAD";
	@index_htm_hair
HTML_TO_BEFORE_HEAD
}

sub write_index_htm_head {
	$index_htm_head[1] = <<"HEAD_CONTENTS";
	@index_htm_head
HEAD_CONTENTS
}

sub write_index_htm_neck {
	$index_htm_neck[1] = <<"BETWEEN_HEAD_AND_BODY";
	@index_htm_neck
BETWEEN_HEAD_AND_BODY
}

sub write_index_htm_body {
	$index_htm_body[1] = <<"BODY_CONTENTS";
	@index_htm_body
BODY_CONTENTS
}

sub write_index_htm_leg {
	$index_htm_leg[1] = <<"BETWEEN_BODY_CLOSE_AND_HTML_CLOSE";
	@index_htm_leg
BETWEEN_BODY_CLOSE_AND_HTML_CLOSE
}

sub write_index_htm_foot {
	$index_htm_foot[1] = <<"HTML_CLOSE";
	@index_htm_foot
HTML_CLOSE
}

sub write_index_htm {
	#my ($parameter_name, $parameter_name ...) = @_;

	#perform second pass substitutions from inclusions

	$index_htm[1] = <<"DOCUMENT";
		$index_htm_hat[1]
		$index_htm_hair[1]
		$index_htm_head[1]
		$index_htm_neck[1]
		$index_htm_body[1]
		$index_htm_leg[1]
		$index_htm_foot[1]
DOCUMENT

	@{index_htm[0]} = split( '\n', $index_htm[1] );
}


evaluate_arguments();
write_index_htm_hat();
write_index_htm_hair();
write_index_htm_head();
write_index_htm_neck();
write_index_htm_body();
write_index_htm_leg();
write_index_htm_foot();
write_index_htm();

my $temporary_filename = $destination_directory.$destination_filename.'.'.$destination_extension;

open(my $fh_output, '>', $temporary_filename)
	or die "could not create $temporary_filename\n";

print $fh_output $index_htm[1];

